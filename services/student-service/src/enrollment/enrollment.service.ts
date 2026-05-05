import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class EnrollmentService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async enrollStudent(studentId: string, enrollmentData: any) {
    // Skeleton implementation
    console.log(`Enrolling student ${studentId} with data:`, enrollmentData);

    // In a real implementation, this would update student status or create enrollment records
    // For now, just return a mock response
    const mockEnrollment = {
      studentId,
      status: 'ENROLLED',
      enrolledAt: new Date(),
      ...enrollmentData,
    };

    await this.eventBus.publish(
      'student.events',
      'student.enrolled',
      mockEnrollment,
    );

    return mockEnrollment;
  }

  async getStudentEnrollments(studentId: string) {
    // Skeleton implementation
    return [
      { id: '1', courseName: 'Introduction to Computer Science', semester: 1 },
      { id: '2', courseName: 'Calculus I', semester: 1 },
    ];
  }
}
