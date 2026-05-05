import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { TransportController } from './transport/controllers/transport.controller';
import { TransportService } from './transport/services/transport.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [TransportController],
  providers: [TransportService],
})
export class AppModule {}
