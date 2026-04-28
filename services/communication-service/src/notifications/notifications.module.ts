import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { EmailDispatcher } from './dispatchers/email.dispatcher';
import { SmsDispatcher } from './dispatchers/sms.dispatcher';

@Module({
  providers: [
    NotificationsService,
    NotificationsGateway,
    EmailDispatcher,
    SmsDispatcher,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
