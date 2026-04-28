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

  // Add other delegates as needed, or just expose prisma
  get client() {
    return prisma;
  }
}
