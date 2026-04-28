import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { eventBus } from '@campuscore/event-bus';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EventsService implements OnModuleInit {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  async onModuleInit() {
    await this.subscribeToEvents();
  }

  private async subscribeToEvents() {
    try {
      // Connect to event bus
      await eventBus.connect();

      // Subscribe to USER_REGISTERED
      await eventBus.subscribe(
        'users',
        'user.registered',
        'communication_user_registered',
        async (data) => {
          this.logger.log(`Received user.registered event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyUserRegistration(data);
        },
      );

      // Subscribe to APPLICATION_ACCEPTED
      await eventBus.subscribe(
        'admissions',
        'application.accepted',
        'communication_application_accepted',
        async (data) => {
          this.logger.log(`Received application.accepted event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyApplicationAccepted(data);
        },
      );

      this.logger.log('Successfully subscribed to all events');
    } catch (error) {
      this.logger.error('Failed to subscribe to events', error.stack);
    }
  }
}
