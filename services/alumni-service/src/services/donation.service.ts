import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { DonationStatus } from '@campuscore/shared-constants';

@Injectable()
export class DonationService {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}

  async initiateDonation(data: {
    alumniId: string;
    amount: number;
    purpose?: string;
    paymentMethod: string;
  }) {
    const transactionId = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const donation = await this.prisma.donation.create({
      data: {
        alumniId: data.alumniId,
        amount: data.amount,
        purpose: data.purpose,
        paymentMethod: data.paymentMethod,
        transactionId,
        status: DonationStatus.INITIATED,
      },
    });

    // Fire event for communication-service to notify admin
    await this.eventBus.publish('donation', 'donation.initiated', {
      donationId: donation.id,
      alumniId: donation.alumniId,
      amount: donation.amount,
      transactionId: donation.transactionId,
    });

    return donation;
  }

  async verifyDonation(id: string) {
    const donation = await this.prisma.donation.update({
      where: { id },
      data: { status: DonationStatus.VERIFIED },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    // Trigger automated engagement/acknowledgment
    await this.eventBus.publish('donation', 'donation.verified', {
      donationId: donation.id,
      alumniId: donation.alumniId,
      amount: donation.amount,
      transactionId: donation.transactionId,
    });

    return donation;
  }

  async rejectDonation(id: string) {
    const donation = await this.prisma.donation.update({
      where: { id },
      data: { status: DonationStatus.REJECTED },
    });

    return donation;
  }

  async getDonations(filters?: { status?: DonationStatus; alumniId?: string }) {
    return this.prisma.donation.findMany({
      where: filters,
      include: { alumni: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateReceipt(id: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: { alumni: { include: { student: { include: { user: true } } } } },
    });

    if (!donation || donation.status !== DonationStatus.VERIFIED) {
      throw new NotFoundException('Verified donation not found');
    }

    // In a real scenario, this would generate a PDF or a structured receipt payload
    return {
      receiptNumber: `REC-${donation.transactionId}`,
      date: donation.updatedAt,
      donor: `${donation.alumni.student.user.firstName} ${donation.alumni.student.user.lastName}`,
      amount: donation.amount,
      purpose: donation.purpose || 'General Alumni Fund',
      status: donation.status,
    };
  }
}
