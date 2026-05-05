import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { EmployeeController, LeaveRequestController } from './controllers/hr.controller';
import { EmployeeService, LeaveRequestService } from './services/hr.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [EmployeeController, LeaveRequestController],
  providers: [EmployeeService, LeaveRequestService],
})
export class AppModule {}
