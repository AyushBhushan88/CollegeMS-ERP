import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class MarksService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async enterMarks(data: any) {
    const marks = await this.prisma.marksEntry.upsert({
      where: {
        examId_subjectId_studentId: {
          examId: data.examId,
          subjectId: data.subjectId,
          studentId: data.studentId,
        },
      },
      update: {
        marksObtained: data.marksObtained,
        isAbsent: data.isAbsent,
        remarks: data.remarks,
      },
      create: data,
    });

    await this.eventBus.publish('examination', 'marks.entered', marks);
    return marks;
  }

  async bulkEnterMarks(data: any[]) {
    const results = await Promise.all(
      data.map((entry) => this.enterMarks(entry))
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
