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
  get route() {
    return this._prisma.route;
  }
  get vehicle() {
    return this._prisma.vehicle;
  }
  get transportAllocation() {
    return this._prisma.transportAllocation;
  }

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
