import { Module } from '@nestjs/common';
import { HallTicketService } from './hall-ticket.service';
import { HallTicketController } from './hall-ticket.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HallTicketService],
  controllers: [HallTicketController],
})
export class HallTicketModule {}
