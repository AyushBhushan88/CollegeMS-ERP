import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { AlumniController } from './controllers/alumni.controller';
import { AlumniService } from './services/alumni.service';
import { MentorshipService } from './services/mentorship.service';
import { DonationService } from './services/donation.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [AlumniController],
  providers: [AlumniService, MentorshipService, DonationService],
})
export class AppModule {}

