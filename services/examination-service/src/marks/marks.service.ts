import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { CreateMarksEntryDto, BulkMarksEntryDto } from '../exams/dto/exam.dto';

@Injectable()
export class MarksService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async enterMarks(dto: CreateMarksEntryDto) {
    const marks = await this.prisma.marksEntry.upsert({
      where: {
        examId_subjectId_studentId: {
          examId: dto.examId,
          subjectId: dto.subjectId,
          studentId: dto.studentId,
        },
      },
      update: {
        marksObtained: dto.marksObtained,
        isAbsent: dto.isAbsent || false,
        remarks: dto.remarks,
      },
      create: {
        ...dto,
        isAbsent: dto.isAbsent || false,
      },
      include: {
        student: { include: { user: true } },
        subject: true,
        exam: true,
      },
    });

    await this.eventBus.publish('examination.events', 'marks.entered', {
      studentId: marks.studentId,
      studentName: `${marks.student.user.firstName} ${marks.student.user.lastName}`,
      studentEmail: marks.student.user.email,
      subjectName: marks.subject.name,
      examName: marks.exam.name,
      marksObtained: marks.marksObtained,
      totalMarks: marks.exam.totalMarks,
    });

    return marks;
  }

  async bulkEnterMarks(dto: BulkMarksEntryDto) {
    const results = await Promise.all(
      dto.entries.map((entry) => this.enterMarks(entry))
    );
    return results;
  }

  async getMarksByStudent(studentId: string) {
    return this.prisma.marksEntry.findMany({
      where: { studentId },
      include: {
        exam: true,
        subject: true,
      },
    });
  }

  async getMarksByExam(examId: string, subjectId?: string) {
    return this.prisma.marksEntry.findMany({
      where: {
        examId,
        ...(subjectId && { subjectId }),
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    });
  }
}
