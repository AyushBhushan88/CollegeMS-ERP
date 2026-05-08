import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async getAllStudents() {
    return this.prisma.student.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        program: true,
        branch: true,
      },
    });
  }

  async getStudentDetails(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isActive: true,
          },
        },
        program: true,
        branch: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async updateStudentProfile(id: string, updateDto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const { firstName, lastName, ...studentData } = updateDto;

    const updatedStudent = await this.prisma.client.$transaction(async (tx) => {
      if (firstName || lastName) {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
          },
        });
      }

      return tx.student.update({
        where: { id },
        data: studentData,
        include: {
          user: true,
          program: true,
          branch: true,
        },
      });
    });

    await this.eventBus.publish('student.events', 'student.updated', {
      studentId: id,
      updatedBy: 'system', // In a real app, this would be the user ID from the JWT
      changes: updateDto,
    });

    return updatedStudent;
  }
}
