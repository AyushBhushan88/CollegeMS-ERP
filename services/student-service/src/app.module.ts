import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { StudentModule } from './student/student.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { AcademicHistoryModule } from './academic-history/academic-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EventBusModule,
    StudentModule,
    EnrollmentModule,
    AcademicHistoryModule,
  ],
})
export class AppModule {}
