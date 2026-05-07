import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class GraduationService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async graduateStudent(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        program: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Broadcast graduation event for alumni service
    await this.eventBus.publish('student.events', 'student.graduated', {
      studentId: student.id,
      userId: student.userId,
      email: student.user.email,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      programName: student.program.name,
      graduationDate: new Date().toISOString(),
    });

    return { success: true, message: 'Student graduation event published successfully' };
  }
}
