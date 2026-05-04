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

      // Subscribe to LEAVE_APPROVED
      await eventBus.subscribe(
        'hr',
        'leave.approved',
        'communication_leave_approved',
        async (data) => {
          this.logger.log(`Received leave.approved event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyLeaveApproved(data);
        },
      );

      // Subscribe to BOOK_OVERDUE
      await eventBus.subscribe(
        'library',
        'book.overdue',
        'communication_book_overdue',
        async (data) => {
          this.logger.log(`Received book.overdue event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyBookOverdue(data);
        },
      );

      // Subscribe to ROOM_ALLOCATED
      await eventBus.subscribe(
        'hostel',
        'room.allocated',
        'communication_room_allocated',
        async (data) => {
          this.logger.log(`Received room.allocated event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyRoomAllocated(data);
        },
      );

      this.logger.log('Successfully subscribed to all events');
    } catch (error) {
      this.logger.error('Failed to subscribe to events', error.stack);
    }
  }
}
