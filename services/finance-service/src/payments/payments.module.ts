import { Module } from '@nestjs/common';
import { RazorpayGateway } from './razorpay.gateway';

@Module({
  providers: [
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: RazorpayGateway,
    },
  ],
  exports: ['PAYMENT_GATEWAY'],
})
export class PaymentsModule {}
