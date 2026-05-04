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

  async notifyLeaveApproved(data: any) {
    const { employeeId, employeeName, leaveType, startDate, endDate } = data;
    const message = `Dear ${employeeName}, your ${leaveType} leave from ${startDate} to ${endDate} has been approved.`;
    this.notificationsGateway.sendNotification(employeeId, 'LEAVE_APPROVED', { message });
  }

  async notifyBookOverdue(data: any) {
    const { studentId, studentName, bookTitle, dueDate, fineAmount } = data;
    const message = `Alert ${studentName}: The book "${bookTitle}" is overdue since ${dueDate}. Current fine: ${fineAmount}. Please return it immediately.`;
    this.notificationsGateway.sendNotification(studentId, 'BOOK_OVERDUE', { message });
  }

  async notifyRoomAllocated(data: any) {
    const { studentId, studentName, hostelName, roomNumber } = data;
    const message = `Hello ${studentName}, you have been allocated Room ${roomNumber} in ${hostelName}.`;
    this.notificationsGateway.sendNotification(studentId, 'ROOM_ALLOCATED', { message });
  }
}
