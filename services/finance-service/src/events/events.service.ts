import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { eventBus } from '@campuscore/event-bus';
import { FinanceService } from '../finance/finance.service';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  constructor(private financeService: FinanceService) {}

  async onModuleInit() {
    await eventBus.connect();
    this.subscribeToEvents();
  }

  async onModuleDestroy() {
    await eventBus.close();
  }

  private async subscribeToEvents() {
    // Subscribe to ADMISSION_CONFIRMED
    await eventBus.subscribe(
      'admission',
      'admission.confirmed',
      'finance.admission_confirmed',
      async (data: any) => {
        console.log(
          '[EventsService] Received ADMISSION_CONFIRMED event:',
          data,
        );
        const { studentId } = data;
        if (studentId) {
          await this.financeService.generateFeesForStudent(studentId);
          console.log(
            `[EventsService] Fees generated for student: ${studentId}`,
          );
        }
      },
    );
  }
}
