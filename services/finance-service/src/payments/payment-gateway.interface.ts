export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface IPaymentGateway {
  createOrder(amount: number, receipt: string): Promise<PaymentOrder>;
  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<boolean>;
}
