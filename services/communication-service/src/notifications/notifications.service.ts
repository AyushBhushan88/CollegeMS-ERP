import { Injectable } from '@nestjs/common';
import { EmailDispatcher } from './dispatchers/email.dispatcher';
import { SmsDispatcher } from './dispatchers/sms.dispatcher';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailDispatcher: EmailDispatcher,
    private readonly smsDispatcher: SmsDispatcher,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async notifyUserRegistration(userData: any) {
    const { email, firstName, userId } = userData;
    const message = `Welcome to CampusCore, ${firstName}! Your registration was successful.`;
    
    // Send Email
    await this.emailDispatcher.send(
      email,
      'Welcome to CampusCore',
      message,
    );

    // Send WebSocket notification
    this.notificationsGateway.sendNotification(userId, 'USER_REGISTERED', {
      message,
    });
  }

  async notifyApplicationAccepted(applicationData: any) {
    const { email, studentName, userId, applicationId } = applicationData;
    const message = `Congratulations ${studentName}! Your application ${applicationId} has been accepted.`;

    // Send Email
    await this.emailDispatcher.send(
      email,
      'Application Accepted',
      message,
    );

    // Send SMS (Skeleton)
    // await this.smsDispatcher.send(phone, message);

    // Send WebSocket notification
    this.notificationsGateway.sendNotification(userId, 'APPLICATION_ACCEPTED', {
      message,
      applicationId,
    });
  }
}
