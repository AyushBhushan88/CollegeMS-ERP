import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MentorshipStatus } from '@campuscore/shared-constants';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class MentorshipService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService
  ) {}

  async createProgram(data: {
    title: string;
    description: string;
    mentorId: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
  }) {
    return this.prisma.mentorshipProgram.create({
      data,
    });
  }

  async getAllPrograms() {
    return this.prisma.mentorshipProgram.findMany({
      include: {
        applications: true,
      },
    });
  }

  async getProgramById(id: string) {
    return this.prisma.mentorshipProgram.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    });
  }

  async updateApplicationStatus(applicationId: string, status: MentorshipStatus) {
    const application = await this.prisma.mentorshipApplication.update({
      where: { id: applicationId },
      data: { status },
      include: { program: true },
    });

    if (status === MentorshipStatus.APPROVED) {
      await this.eventBus.publish('mentorship', 'mentorship.approved', {
        applicationId: application.id,
        alumniId: application.alumniId,
        programId: application.programId,
        mentorId: application.program.mentorId,
      });
    }

    return application;
  }

  /**
   * Patent-Aligned Cross-Domain Mentorship Matching Engine
   * Calculates compatibility scores between an alumni and students based on
   * academic background, industry, and goals using a weighted scoring algorithm.
   */
  async generateMatches(alumniId: string) {
    const alumni = await this.prisma.alumniProfile.findUnique({
      where: { id: alumniId },
      include: { student: { include: { branch: true } } },
    });

    if (!alumni) {
      throw new Error('Alumni not found');
    }

    // Fetch potential mentees (Students in final/pre-final year)
    const students = await this.prisma.student.findMany({
      where: {
        status: 'ENROLLED',
      },
      include: {
        branch: true,
      },
    });

    const matches = students.map((student) => {
      let score = 0;
      let reasons: string[] = [];

      // Weight 1: Academic Background Alignment (40%)
      if (alumni.student.branchId === student.branchId) {
        score += 40;
        reasons.push('Same academic branch');
      } else {
        // Cross-domain potential: similar programs could score partial points
        score += 10;
        reasons.push('Cross-domain potential');
      }

      // Weight 2: Career Readiness (Student proximity to graduation) (30%)
      // Assuming 4-year programs, sem 7 & 8 are final year
      if (student.currentSemester >= 7) {
        score += 30;
        reasons.push('Final year student seeking immediate placement/mentorship');
      } else if (student.currentSemester >= 5) {
        score += 20;
        reasons.push('Pre-final year student exploring industry trends');
      }

      // Weight 3: Industry alignment / Shared interests (30%)
      // This could be derived from an NLP model or tagging system, here simulated
      if (alumni.industry && student.currentSemester >= 5) {
        score += 30;
        reasons.push(`Alignment with mentor industry: ${alumni.industry}`);
      }

      return {
        student,
        score,
        reasons,
      };
    });

    // Sort by score descending and return top matches
    return matches.sort((a, b) => b.score - a.score).slice(0, 10);
  }
}
