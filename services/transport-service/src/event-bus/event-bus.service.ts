import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@campuscore/event-bus';

@Injectable()
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  private eventBus: EventBus;

  constructor(private configService: ConfigService) {
    const rabbitUrl =
      this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost';
    this.eventBus = new EventBus(rabbitUrl);
  }

  async onModuleInit() {
    await this.eventBus.connect();
  }

  async onModuleDestroy() {
    await this.eventBus.close();
  }

  async publish<T = any>(
    exchange: string,
    routingKey: string,
    message: T,
  ): Promise<void> {
    await this.eventBus.publish(exchange, routingKey, message);
  }

  async subscribe<T = any>(
    exchange: string,
    routingKey: string,
    queue: string,
    onMessage: (message: T) => Promise<void>,
  ): Promise<void> {
    await this.eventBus.subscribe(exchange, routingKey, queue, onMessage);
  }
}
