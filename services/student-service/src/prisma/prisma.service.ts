import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@campuscore/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly _prisma = prisma;

  get student() {
    return this._prisma.student;
  }
  get user() {
    return this._prisma.user;
  }
  get program() {
    return this._prisma.program;
  }
  get branch() {
    return this._prisma.branch;
  }
  get admissionApplication() {
    return this._prisma.admissionApplication;
  }
  // Add other models as needed

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
