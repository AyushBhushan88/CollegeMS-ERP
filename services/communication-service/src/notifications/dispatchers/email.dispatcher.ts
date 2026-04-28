import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailDispatcher {
  private readonly logger = new Logger(EmailDispatcher.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure for MailHog or other SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'localhost',
      port: parseInt(process.env.MAIL_PORT, 10) || 1025,
      ignoreTLS: true,
    });
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"CampusCore" <noreply@campuscore.com>',
        to,
        subject,
        text: body,
        html: body,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }
}
