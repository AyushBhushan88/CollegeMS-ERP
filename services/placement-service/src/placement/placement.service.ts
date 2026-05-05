import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlacementDriveDto, ApplyDriveDto, UpdateApplicationStatusDto, RecordResultDto } from './dto/placement.dto';
import { PlacementStatus } from '@campuscore/database';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class PlacementService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async createDrive(dto: CreatePlacementDriveDto) {
    return this.prisma.placementDrive.create({
      data: {
        companyName: dto.companyName,
        date: new Date(dto.date),
        eligibilityCriteria: dto.eligibilityCriteria || {},
        packageDetails: dto.packageDetails,
      },
    });
  }

  async findAllDrives() {
    return this.prisma.placementDrive.findMany({
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { date: 'desc' },
    });
  }

  async findDriveDetails(id: string) {
    const drive = await this.prisma.placementDrive.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            student: {
              include: { user: true }
            },
            result: true
          }
        }
      }
    });

    if (!drive) throw new NotFoundException('Placement drive not found');
    return drive;
  }

  async apply(dto: ApplyDriveDto) {
    const drive = await this.prisma.placementDrive.findUnique({ where: { id: dto.driveId } });
    if (!drive) throw new NotFoundException('Drive not found');

    const student = await this.prisma.student.findUnique({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const existing = await this.prisma.placementApplication.findUnique({
      where: {
        driveId_studentId: {
          driveId: dto.driveId,
          studentId: dto.studentId,
        }
      }
    });

    if (existing) throw new ConflictException('You have already applied for this drive');

    // Check eligibilityCriteria here
    const eligibilityCriteria: any = drive.eligibilityCriteria || {};
    const minCgpa = eligibilityCriteria.minCgpa || 0;

    const latestTranscript = await this.prisma.transcript.findFirst({
      where: { studentId: dto.studentId },
      orderBy: { semester: 'desc' },
    });

    if (minCgpa > 0) {
      if (!latestTranscript || latestTranscript.cgpa < minCgpa) {
        throw new BadRequestException(`You do not meet the minimum CGPA requirement of ${minCgpa}`);
      }
    }

    if (eligibilityCriteria.noActiveBacklogs) {
       // A simple check if the latest result status is FAIL
       if (latestTranscript && latestTranscript.resultStatus === 'FAIL') {
         throw new BadRequestException('You are not eligible due to active backlogs');
       }
    }

    return this.prisma.placementApplication.create({
      data: {
        driveId: dto.driveId,
        studentId: dto.studentId,
        resumeUrl: dto.resumeUrl,
        status: PlacementStatus.PENDING,
      }
    });
  }

  async updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto) {
    const application = await this.prisma.placementApplication.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        drive: true,
      }
    });

    if (!application) throw new NotFoundException('Application not found');

    const updated = await this.prisma.placementApplication.update({
      where: { id },
      data: { status: dto.status },
    });

    await this.eventBus.publish('placement.events', 'application.status_updated', {
      applicationId: id,
      studentId: application.studentId,
      studentEmail: application.student.user.email,
      studentName: `${application.student.user.firstName} ${application.student.user.lastName}`,
      companyName: application.drive.companyName,
      status: dto.status,
    });

    return updated;
  }

  async recordResult(dto: RecordResultDto) {
    const application = await this.prisma.placementApplication.findUnique({
      where: { id: dto.applicationId },
      include: {
        result: true,
        student: { include: { user: true } },
        drive: true,
      }
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.result) throw new ConflictException('Result already recorded for this application');

    const result = await this.prisma.placementResult.create({
      data: {
        applicationId: dto.applicationId,
        offerLetterUrl: dto.offerLetterUrl,
        packageOffered: dto.packageOffered,
      }
    });

    await this.eventBus.publish('placement.events', 'placement.offered', {
      resultId: result.id,
      studentId: application.studentId,
      studentEmail: application.student.user.email,
      studentName: `${application.student.user.firstName} ${application.student.user.lastName}`,
      companyName: application.drive.companyName,
      packageOffered: dto.packageOffered,
    });

    return result;
  }

  async getStats() {
    const [totalDrives, totalApplications, totalOffers] = await Promise.all([
      this.prisma.placementDrive.count(),
      this.prisma.placementApplication.count(),
      this.prisma.placementResult.count(),
    ]);

    return {
      totalDrives,
      totalApplications,
      totalOffers,
    };
  }
}
