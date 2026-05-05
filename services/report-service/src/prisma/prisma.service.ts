import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@campuscore/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }

  get user() {
    return prisma.user;
  }
  get student() {
    return prisma.student;
  }
  get employeeProfile() {
    return prisma.employeeProfile;
  }
  get program() {
    return prisma.program;
  }
  get placementDrive() {
    return prisma.placementDrive;
  }
  get placementResult() {
    return prisma.placementResult;
  }
  get admissionApplication() {
    return prisma.admissionApplication;
  }
  get transcript() {
    return prisma.transcript;
  }
  get attendanceRecord() {
    return prisma.attendanceRecord;
  }
  get client() {
    return prisma;
  }
}
