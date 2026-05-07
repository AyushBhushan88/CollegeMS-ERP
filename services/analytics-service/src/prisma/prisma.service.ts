import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@campuscore/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly _prisma = prisma;

  get student() { return this._prisma.student; }
  get user() { return this._prisma.user; }
  get program() { return this._prisma.program; }
  get branch() { return this._prisma.branch; }
  get attendanceRecord() { return this._prisma.attendanceRecord; }
  get marksEntry() { return this._prisma.marksEntry; }
  get admissionApplication() { return this._prisma.admissionApplication; }
  get employeeProfile() { return this._prisma.employeeProfile; }
  get leaveRequest() { return this._prisma.leaveRequest; }
  get leaveBalance() { return this._prisma.leaveBalance; }
  get grievanceCategory() { return this._prisma.grievanceCategory; }
  get grievanceCommittee() { return this._prisma.grievanceCommittee; }
  get grievance() { return this._prisma.grievance; }
  get grievanceComment() { return this._prisma.grievanceComment; }
  get alumniProfile() { return this._prisma.alumniProfile; }
  get alumniEvent() { return this._prisma.alumniEvent; }
  get mentorshipProgram() { return this._prisma.mentorshipProgram; }
  get mentorshipApplication() { return this._prisma.mentorshipApplication; }
  get donation() { return this._prisma.donation; }

  async onModuleInit() {
    // Connection is handled by the shared prisma client
  }

  async onModuleDestroy() {
    await this._prisma.$disconnect();
  }

  get client() {
    return this._prisma;
  }
}
