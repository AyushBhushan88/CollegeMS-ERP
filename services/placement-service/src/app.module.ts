import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PlacementController } from './placement/placement.controller';
import { PlacementService } from './placement/placement.service';
import { EventBusModule } from './event-bus/event-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EventBusModule,
  ],
  controllers: [PlacementController],
  providers: [PlacementService],
})
export class AppModule {}
