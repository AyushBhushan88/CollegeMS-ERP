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

  get user() { return prisma.user; }
  get student() { return prisma.student; }
  get transcript() { return prisma.transcript; }
  get placementDrive() { return prisma.placementDrive; }
  get placementApplication() { return prisma.placementApplication; }
  get placementResult() { return prisma.placementResult; }
  get client() {
    return prisma;
  }
}
