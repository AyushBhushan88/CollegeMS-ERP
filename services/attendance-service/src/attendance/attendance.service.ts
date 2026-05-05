import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { GetAttendanceQueryDto } from './dto/get-attendance-query.dto';
import { AttendanceStatus } from '@campuscore/shared-constants';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async markAttendance(dto: MarkAttendanceDto) {
    const { subjectId, sectionId, date, markedById, records } = dto;
    const attendanceDate = new Date(date);

    this.logger.log(`Marking attendance for subject ${subjectId}, section ${sectionId} on ${date}`);

    const results = await Promise.all(
      records.map(async (record) => {
        const attendanceRecord = await this.prisma.attendanceRecord.upsert({
          where: {
            studentId_subjectId_date: {
              studentId: record.studentId,
              subjectId,
              date: attendanceDate,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            markedById,
            sectionId,
          },
          create: {
            studentId: record.studentId,
            subjectId,
            sectionId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks,
            markedById,
          },
        });

        // Check for shortage after marking
        await this.checkAndNotifyShortage(record.studentId, subjectId);

        return attendanceRecord;
      }),
    );

    return results;
  }

  async getAttendance(query: GetAttendanceQueryDto) {
    const { studentId, subjectId, sectionId, startDate, endDate } = query;

    return this.prisma.attendanceRecord.findMany({
      where: {
        ...(studentId && { studentId }),
        ...(subjectId && { subjectId }),
        ...(sectionId && { sectionId }),
        ...(startDate || endDate
          ? {
              date: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {}),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        subject: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getStudentStats(studentId: string, subjectId?: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        studentId,
        ...(subjectId && { subjectId }),
      },
    });

    const total = records.length;
    if (total === 0) return { total: 0, present: 0, percentage: 100 };

    const present = records.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE,
    ).length;

    const percentage = (present / total) * 100;

    return { total, present, percentage };
  }

  private async checkAndNotifyShortage(studentId: string, subjectId: string) {
    const stats = await this.getStudentStats(studentId, subjectId);

    if (stats.percentage < 75) {
      this.logger.warn(
        `Attendance shortage detected for student ${studentId} in subject ${subjectId}: ${stats.percentage.toFixed(2)}%`,
      );

      await this.eventBus.publish('attendance.events', 'attendance.shortage', {
        studentId,
        subjectId,
        percentage: stats.percentage,
        totalClasses: stats.total,
        presentClasses: stats.present,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
