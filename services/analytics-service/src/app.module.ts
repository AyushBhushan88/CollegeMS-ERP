import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AppModule {}
