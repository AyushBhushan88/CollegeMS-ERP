import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import { ApplicationStatus } from '@campuscore/database';

@Injectable()
export class AdmissionService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async submitApplication(userId: string, dto: SubmitApplicationDto) {
    // Check if user already has an application for this program
    const existingApplication = await this.prisma.admissionApplication.findFirst({
      where: {
        userId,
        programId: dto.programId,
      },
    });

    if (existingApplication) {
      throw new ConflictException('Application already submitted for this program');
    }

    // Check if program exists
    const program = await this.prisma.program.findUnique({
      where: { id: dto.programId },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    const application = await this.prisma.admissionApplication.create({
      data: {
        userId,
        programId: dto.programId,
        status: ApplicationStatus.PENDING,
        personalDetails: dto.personalDetails as any,
        academicDetails: dto.academicDetails as any,
        choiceOfProgram: {
          preferredPrograms: dto.preferredPrograms,
        } as any,
      },
    });

    // Publish event
    await this.eventBus.publish('admissions.events', 'application.submitted', {
      applicationId: application.id,
      userId,
      programId: dto.programId,
      studentName: `${(application.personalDetails as any)?.firstName || 'Student'}`, // fallback
    });

    return application;
  }

  async findAllApplications() {
    return this.prisma.admissionApplication.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        program: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserApplications(userId: string) {
    return this.prisma.admissionApplication.findMany({
      where: { userId },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: { status: ApplicationStatus; remarks?: string }) {
    const application = await this.prisma.admissionApplication.findUnique({
      where: { id },
      include: {
        user: true,
        program: true,
      }
    });

    if (!application) throw new NotFoundException('Application not found');

    const updated = await this.prisma.admissionApplication.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    await this.eventBus.publish('admissions.events', `application.${dto.status.toLowerCase()}`, {
      applicationId: id,
      userId: application.userId,
      email: application.user.email,
      studentName: `${application.user.firstName} ${application.user.lastName}`,
      programName: application.program.name,
      status: dto.status,
    });

    return updated;
  }

  async getMeritList(programId: string) {
    // Skeleton implementation
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // In a real implementation, this would involve complex logic based on academic details
    const applications = await this.prisma.admissionApplication.findMany({
      where: {
        programId,
        status: ApplicationStatus.ACCEPTED,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return applications.map((app, index) => ({
      rank: index + 1,
      applicationId: app.id,
      studentName: `${app.user.firstName} ${app.user.lastName}`,
      score: (app.academicDetails as any).twelfthPercentage, // Simple scoring for skeleton
    })).sort((a, b) => b.score - a.score);
  }
}
