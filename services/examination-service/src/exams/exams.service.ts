import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { ScheduleExamDto } from './dto/exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async scheduleExam(dto: ScheduleExamDto) {
    const { schedules, ...examData } = dto;
    
    const exam = await this.prisma.exam.create({
      data: {
        ...examData,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        schedules: {
          create: schedules.map(s => ({
            ...s,
            date: new Date(s.date)
          }))
        }
      },
      include: {
        schedules: true,
        branch: true
      }
    });

    await this.eventBus.publish('examination.events', 'exam.scheduled', {
      examId: exam.id,
      name: exam.name,
      startDate: exam.startDate,
      branch: exam.branch.name,
    });

    return exam;
  }

  async getAllExams() {
    return this.prisma.exam.findMany({
      include: {
        schedules: true,
        branch: true
      }
    });
  }

  async getExamById(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            subject: true
          }
        },
        branch: true
      }
    });
  }
}
