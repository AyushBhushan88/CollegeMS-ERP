import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [FinanceModule],
  providers: [EventsService],
})
export class EventsModule {}
