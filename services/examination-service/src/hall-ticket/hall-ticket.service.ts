import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus, TransactionStatus } from '@campuscore/database';

export interface AttendanceResult {
  subjectId: string;
  subjectName: string;
  percentage: number;
  eligible: boolean;
  totalClasses: number;
  attendedClasses: number;
}

@Injectable()
export class HallTicketService {
  constructor(private prisma: PrismaService) {}

  async checkEligibility(studentId: string, examId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new BadRequestException('Exam not found');
    }

    const semester = exam.semester;
    const reasons: string[] = [];

    // 1. Check Attendance > 75% for all subjects in the semester
    const subjects = await this.prisma.subject.findMany({
      where: {
        branchId: student.branchId,
        semester: semester,
      },
    });

    if (subjects.length === 0) {
      throw new BadRequestException(`No subjects found for semester ${semester}`);
    }

    let totalPercentage = 0;
    const attendanceResults: AttendanceResult[] = [];
    for (const subject of subjects) {
      const records = await this.prisma.attendanceRecord.findMany({
        where: {
          studentId: studentId,
          subjectId: subject.id,
        },
      });

      if (records.length === 0) {
        attendanceResults.push({
          subjectId: subject.id,
          subjectName: subject.name,
          percentage: 100,
          eligible: true,
          totalClasses: 0,
          attendedClasses: 0,
        });
        totalPercentage += 100;
        continue;
      }

      const attendedCount = records.filter(
        (r) =>
          r.status === AttendanceStatus.PRESENT ||
          r.status === AttendanceStatus.LATE ||
          r.status === AttendanceStatus.EXCUSED,
      ).length;

      const percentage = (attendedCount / records.length) * 100;
      totalPercentage += percentage;
      attendanceResults.push({
        subjectId: subject.id,
        subjectName: subject.name,
        percentage,
        eligible: percentage >= 75,
        totalClasses: records.length,
        attendedClasses: attendedCount,
      });
    }

    const avgAttendance = totalPercentage / subjects.length;
    const isAttendanceEligible = attendanceResults.every((r) => r.eligible);
    if (!isAttendanceEligible) {
      reasons.push('Minimum 75% attendance required in all subjects');
    }

    // 2. Check all mandatory fees for the semester must be paid
    const feeStructure = await this.prisma.feeStructure.findFirst({
      where: {
        programId: student.programId,
        batchYear: student.batchYear,
        category: student.category,
        semester: semester,
      },
    });

    let isFeesEligible = false;
    let feeDetails: any = null;

    if (!feeStructure) {
      isFeesEligible = true;
      feeDetails = {
        message: 'No fee structure found for this semester',
        isFeesEligible: true,
      };
    } else {
      const successfulTransactions = await this.prisma.transaction.findMany({
        where: {
          studentId: studentId,
          feeStructureId: feeStructure.id,
          status: TransactionStatus.SUCCESS,
        },
      });

      const totalPaid = successfulTransactions.reduce(
        (sum, t) => sum + Number(t.amount),
        0,
      );
      
      isFeesEligible = totalPaid >= Number(feeStructure.totalAmount);
      if (!isFeesEligible) {
        reasons.push('Pending semester fees');
      }
      
      feeDetails = {
        totalAmount: Number(feeStructure.totalAmount),
        totalPaid,
        isFeesEligible,
      };
    }

    return {
      studentId,
      studentName: student.enrollmentNumber,
      semester,
      isEligible: isAttendanceEligible && isFeesEligible,
      isAttendanceEligible,
      isFeesEligible,
      attendancePercentage: Math.round(avgAttendance),
      feesPaid: isFeesEligible,
      reasons,
      attendanceResults,
      feeDetails,
    };
  }
}
