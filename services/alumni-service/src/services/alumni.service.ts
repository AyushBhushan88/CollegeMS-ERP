import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { AlumniStatus, MentorshipStatus } from '@campuscore/shared-constants';
import { RegisterAlumniDto } from '@campuscore/shared-types';

@Injectable()
export class AlumniService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async onModuleInit() {
    // Listen for student graduation to auto-create alumni profile
    await this.eventBus.subscribe(
      'student',
      'student.graduated',
      'alumni-service.graduation-queue',
      async (data: any) => {
        await this.handleStudentGraduation(data);
      }
    );
  }

  private async handleStudentGraduation(data: any) {
    const { studentId, graduationYear } = data;
    
    // Check if profile already exists
    const existing = await this.prisma.alumniProfile.findUnique({
      where: { studentId }
    });

    if (!existing) {
      await this.prisma.alumniProfile.create({
        data: {
          studentId,
          graduationYear,
          status: AlumniStatus.VERIFIED, // Auto-verified since they graduated from SIS
        }
      });
      console.log(`Auto-created alumni profile for student ${studentId}`);
    }
  }

  async register(dto: RegisterAlumniDto) {
    return this.prisma.alumniProfile.create({
      data: {
        ...dto,
        status: AlumniStatus.UNVERIFIED,
      }
    });
  }

  async verifyProfile(id: string) {
    return this.prisma.alumniProfile.update({
      where: { id },
      data: { status: AlumniStatus.VERIFIED }
    });
  }

  async updatePrivacySettings(id: string, settings: any) {
    return this.prisma.alumniProfile.update({
      where: { id },
      data: { privacySettings: settings }
    });
  }

  async findDirectory(filters: { batch?: number, industry?: string, department?: string }) {
    const profiles = await this.prisma.alumniProfile.findMany({
      where: {
        graduationYear: filters.batch ? Number(filters.batch) : undefined,
        industry: filters.industry,
        student: filters.department ? {
          branch: { name: filters.department }
        } : undefined,
        status: AlumniStatus.VERIFIED,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              }
            },
            branch: true,
          }
        }
      }
    });

    return profiles.map(profile => {
      const settings = (profile.privacySettings as any) || {};
      
      return {
        ...profile,
        student: {
          ...profile.student,
          user: {
            ...profile.student.user,
            email: settings.hideEmail ? null : profile.student.user.email,
            phone: settings.hidePhone ? null : profile.student.user.phone,
          }
        },
        currentCompany: settings.hideCompany ? null : profile.currentCompany,
        location: settings.hideLocation ? null : profile.location,
        linkedInUrl: settings.hideLinkedIn ? null : profile.linkedInUrl,
      };
    });
  }

  async createEvent(data: any) {
    return this.prisma.alumniEvent.create({ data });
  }

  async findAllEvents() {
    return this.prisma.alumniEvent.findMany();
  }

  async registerForEvent(eventId: string, userId: string) {
    const event = await this.prisma.alumniEvent.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new NotFoundException('Event not found');

    const registrations = event.registrations as string[];
    if (!registrations.includes(userId)) {
      registrations.push(userId);
    }

    return this.prisma.alumniEvent.update({
      where: { id: eventId },
      data: { registrations }
    });
  }

  async applyForMentorship(programId: string, alumniId: string, statement: string) {
    return this.prisma.mentorshipApplication.create({
      data: {
        programId,
        alumniId,
        statement,
        status: MentorshipStatus.PENDING,
      }
    });
  }
}
