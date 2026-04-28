import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FinanceModule } from './finance/finance.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FinanceModule,
    EventsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
