import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async scheduleExam(data: any) {
    const { schedules, ...examData } = data;
    
    const exam = await this.prisma.exam.create({
      data: {
        ...examData,
        schedules: {
          create: schedules
        }
      },
      include: {
        schedules: true
      }
    });

    await this.eventBus.publish('examination', 'exam.scheduled', exam);
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
