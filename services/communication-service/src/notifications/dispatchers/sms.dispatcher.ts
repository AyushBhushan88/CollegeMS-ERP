import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsDispatcher {
  private readonly logger = new Logger(SmsDispatcher.name);

  async send(to: string, message: string): Promise<void> {
    // Skeleton implementation for SMS
    this.logger.log(`[SMS SKELETON] Sending SMS to ${to}: ${message}`);
    // In a real scenario, you would integrate with Twilio, AWS SNS, etc.
    return Promise.resolve();
  }
}
