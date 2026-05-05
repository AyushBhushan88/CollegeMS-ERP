import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaymentGateway, PaymentOrder } from './payment-gateway.interface';

@Injectable()
export class RazorpayGateway implements IPaymentGateway {
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(private configService: ConfigService) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    this.keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
  }

  async createOrder(amount: number, receipt: string): Promise<PaymentOrder> {
    console.log(
      `[Razorpay] Creating order for amount: ${amount}, receipt: ${receipt}`,
    );

    // Skeleton implementation
    // In a real scenario, you would use 'razorpay' npm package here
    /*
    const instance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
    const order = await instance.orders.create({
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: receipt,
    });
    return {
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      receipt: order.receipt
    };
    */

    return {
      orderId: `order_fake_${Date.now()}`,
      amount,
      currency: 'INR',
      receipt,
    };
  }

  async verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<boolean> {
    console.log(
      `[Razorpay] Verifying signature for order: ${orderId}, payment: ${paymentId}`,
    );

    // Skeleton implementation
    /*
    const generated_signature = crypto
      .createHmac('sha256', this.keySecret)
      .update(orderId + "|" + paymentId)
      .digest('hex');
    return generated_signature === signature;
    */

    return true;
  }
}
