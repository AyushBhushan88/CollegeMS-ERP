import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { GrievanceController } from './controllers/grievance.controller';
import { GrievanceService } from './services/grievance.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [GrievanceController],
  providers: [GrievanceService],
})
export class AppModule {}
