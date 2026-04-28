import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdmissionModule } from './admission/admission.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AdmissionModule,
  ],
})
export class AppModule {}
