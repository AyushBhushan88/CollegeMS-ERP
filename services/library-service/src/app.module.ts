import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { LibraryController } from './library/controllers/library.controller';
import { LibraryService } from './library/services/library.service';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class AppModule {}
