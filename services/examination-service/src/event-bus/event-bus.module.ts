import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBusService } from './event-bus.service';

@Global()
@Module({
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}
