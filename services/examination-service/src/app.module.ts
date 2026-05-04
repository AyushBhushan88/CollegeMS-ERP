import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { ExamsModule } from './exams/exams.module';
import { MarksModule } from './marks/marks.module';
import { TranscriptsModule } from './transcripts/transcripts.module';
import { HallTicketModule } from './hall-ticket/hall-ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EventBusModule,
    ExamsModule,
    MarksModule,
    TranscriptsModule,
    HallTicketModule,
  ],
})
export class AppModule {}
