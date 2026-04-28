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
    await this.eventBus.publish('admission', 'application.submitted', {
      applicationId: application.id,
      userId,
      programId: dto.programId,
    });

    return application;
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
