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
    await this.emailDispatcher.send(email, 'Welcome to CampusCore', message);

    // Send WebSocket notification
    this.notificationsGateway.sendNotification(userId, 'USER_REGISTERED', {
      message,
    });
  }

  async notifyApplicationAccepted(applicationData: any) {
    const { email, studentName, userId, applicationId } = applicationData;
    const message = `Congratulations ${studentName}! Your application ${applicationId} has been accepted.`;

    // Send Email
    await this.emailDispatcher.send(email, 'Application Accepted', message);

    // Send SMS (Skeleton)
    // await this.smsDispatcher.send(phone, message);

    // Send WebSocket notification
    this.notificationsGateway.sendNotification(userId, 'APPLICATION_ACCEPTED', {
      message,
      applicationId,
    });
  }

  async notifyLeaveStatusUpdate(data: any) {
    const { employeeEmail, status, requestId } = data;
    const message = `Your leave request ${requestId} has been ${status.toLowerCase()}.`;

    await this.emailDispatcher.send(
      employeeEmail,
      `Leave Request ${status.charAt(0) + status.slice(1).toLowerCase()}`,
      message,
    );

    this.notificationsGateway.sendNotification(data.employeeId, 'LEAVE_STATUS_UPDATED', {
      message,
      status,
    });
  }

  async notifyBookIssued(data: any) {
    const { userEmail, bookTitle, dueDate, userName } = data;
    const message = `Hello ${userName}, the book "${bookTitle}" has been issued to you. Please return it by ${new Date(dueDate).toLocaleDateString()}.`;

    await this.emailDispatcher.send(userEmail, 'Book Issued', message);

    this.notificationsGateway.sendNotification(data.studentId || data.employeeId, 'BOOK_ISSUED', {
      message,
    });
  }

  async notifyBookReturned(data: any) {
    const { userEmail, bookTitle, fineAmount, userName } = data;
    let message = `Hello ${userName}, you have successfully returned "${bookTitle}".`;
    if (fineAmount > 0) {
      message += ` A fine of $${fineAmount} has been recorded for late return.`;
    }

    await this.emailDispatcher.send(userEmail, 'Book Returned', message);

    this.notificationsGateway.sendNotification(data.studentId || data.employeeId, 'BOOK_RETURNED', {
      message,
    });
  }

  async notifyRoomAllocated(data: any) {
    const { studentEmail, studentName, hostelName, roomNumber } = data;
    const message = `Hello ${studentName}, you have been allocated Room ${roomNumber} in ${hostelName}.`;

    await this.emailDispatcher.send(studentEmail, 'Hostel Room Allocated', message);

    this.notificationsGateway.sendNotification(data.studentId, 'ROOM_ALLOCATED', { message });
  }

  async notifyPlacementStatusUpdate(data: any) {
    const { studentEmail, studentName, companyName, status } = data;
    const message = `Hello ${studentName}, your application status for ${companyName} has been updated to ${status}.`;

    await this.emailDispatcher.send(studentEmail, 'Placement Application Update', message);

    this.notificationsGateway.sendNotification(data.studentId, 'PLACEMENT_STATUS_UPDATED', {
      message,
      status,
    });
  }

  async notifyPlacementOffered(data: any) {
    const { studentEmail, studentName, companyName, packageOffered } = data;
    const message = `Congratulations ${studentName}! You have received a placement offer from ${companyName} with a package of ${packageOffered}.`;

    await this.emailDispatcher.send(studentEmail, 'Placement Offer Received', message);

    this.notificationsGateway.sendNotification(data.studentId, 'PLACEMENT_OFFERED', { message });
  }

  async notifyExamScheduled(data: any) {
    const { name, startDate, branch } = data;
    const message = `New examination "${name}" has been scheduled starting from ${new Date(startDate).toLocaleDateString()} for ${branch} students.`;

    // Send broadcast notification via WebSocket (using a special room or system-wide logic)
    this.notificationsGateway.sendNotification('all', 'EXAM_SCHEDULED', { message });
  }

  async notifyMarksEntered(data: any) {
    const {
      studentEmail,
      studentName,
      subjectName,
      examName,
      marksObtained,
      totalMarks,
      studentId,
    } = data;
    const message = `Hello ${studentName}, your marks for ${subjectName} in ${examName} have been recorded: ${marksObtained}/${totalMarks}.`;

    await this.emailDispatcher.send(studentEmail, 'Examination Results Updated', message);

    this.notificationsGateway.sendNotification(studentId, 'MARKS_ENTERED', { message });
  }
}
