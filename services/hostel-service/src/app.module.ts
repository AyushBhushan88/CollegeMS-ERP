import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { HostelController } from './hostel/controllers/hostel.controller';
import { HostelService } from './hostel/services/hostel.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [HostelController],
  providers: [HostelService],
})
export class AppModule {}
