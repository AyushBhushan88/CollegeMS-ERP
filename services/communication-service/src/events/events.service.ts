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

      // Subscribe to LEAVE_STATUS_UPDATED
      await eventBus.subscribe(
        'hr.events',
        'leave.status_updated',
        'communication_leave_status_updated',
        async (data) => {
          this.logger.log(`Received leave.status_updated event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyLeaveStatusUpdate(data);
        },
      );

      // Subscribe to BOOK_ISSUED
      await eventBus.subscribe(
        'library.events',
        'book.issued',
        'communication_book_issued',
        async (data) => {
          this.logger.log(`Received book.issued event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyBookIssued(data);
        },
      );

      // Subscribe to BOOK_RETURNED
      await eventBus.subscribe(
        'library.events',
        'book.returned',
        'communication_book_returned',
        async (data) => {
          this.logger.log(`Received book.returned event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyBookReturned(data);
        },
      );

      // Subscribe to ROOM_ALLOCATED
      await eventBus.subscribe(
        'hostel.events',
        'room.allocated',
        'communication_room_allocated',
        async (data) => {
          this.logger.log(`Received room.allocated event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyRoomAllocated(data);
        },
      );

      // Subscribe to PLACEMENT_STATUS_UPDATED
      await eventBus.subscribe(
        'placement.events',
        'application.status_updated',
        'communication_placement_status_updated',
        async (data) => {
          this.logger.log(`Received application.status_updated event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyPlacementStatusUpdate(data);
        },
      );

      // Subscribe to PLACEMENT_OFFERED
      await eventBus.subscribe(
        'placement.events',
        'placement.offered',
        'communication_placement_offered',
        async (data) => {
          this.logger.log(`Received placement.offered event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyPlacementOffered(data);
        },
      );

      // Subscribe to EXAM_SCHEDULED
      await eventBus.subscribe(
        'examination.events',
        'exam.scheduled',
        'communication_exam_scheduled',
        async (data) => {
          this.logger.log(`Received exam.scheduled event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyExamScheduled(data);
        },
      );

      // Subscribe to MARKS_ENTERED
      await eventBus.subscribe(
        'examination.events',
        'marks.entered',
        'communication_marks_entered',
        async (data) => {
          this.logger.log(`Received marks.entered event: ${JSON.stringify(data)}`);
          await this.notificationsService.notifyMarksEntered(data);
        },
      );

      this.logger.log('Successfully subscribed to all events');
    } catch (error) {
      this.logger.error('Failed to subscribe to events', error.stack);
    }
  }
}
