import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
