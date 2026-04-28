import { connect, ConsumeMessage, Options } from 'amqplib';

export interface Event {
  pattern: string;
  data: any;
}

export interface IEventBus {
  connect(): Promise<void>;
  publish<T = any>(exchange: string, routingKey: string, message: T): Promise<void>;
  subscribe<T = any>(
    exchange: string,
    routingKey: string,
    queue: string,
    onMessage: (message: T) => Promise<void>,
  ): Promise<void>;
  close(): Promise<void>;
}

export class EventBus implements IEventBus {
  private connection: any = null;
  private channel: any = null;
  private readonly url: string;
  private isConnecting = false;

  constructor(url?: string) {
    this.url = url || process.env.RABBITMQ_URL || 'amqp://localhost';
  }

  async connect(): Promise<void> {
    if (this.connection || this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.connection = await connect(this.url);
      this.channel = await this.connection.createChannel();

      this.connection.on('error', (err: any) => {
        console.error('[EventBus] Connection error', err);
        this.connection = null;
        this.channel = null;
      });

      this.connection.on('close', () => {
        console.warn('[EventBus] Connection closed');
        this.connection = null;
        this.channel = null;
      });

      console.log('[EventBus] Connected to RabbitMQ');
    } catch (error) {
      console.error('[EventBus] Failed to connect to RabbitMQ', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async publish<T = any>(
    exchange: string,
    routingKey: string,
    message: T,
    options?: Options.Publish,
  ): Promise<void> {
    if (!this.channel) await this.connect();
    if (!this.channel) throw new Error('[EventBus] Failed to create channel');

    await this.channel.assertExchange(exchange, 'topic', { durable: true });

    const success = this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true, ...options },
    );

    if (!success) {
      throw new Error('[EventBus] Failed to publish message: channel buffer full');
    }
  }

  async subscribe<T = any>(
    exchange: string,
    routingKey: string,
    queue: string,
    onMessage: (message: T) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) await this.connect();
    if (!this.channel) throw new Error('[EventBus] Failed to create channel');

    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);

    await this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg && this.channel) {
        try {
          const content = JSON.parse(msg.content.toString()) as T;
          await onMessage(content);
          this.channel.ack(msg);
        } catch (error) {
          console.error('[EventBus] Error processing message', error);
          // Potential DLQ or retry logic here
          this.channel.nack(msg, false, false);
        }
      }
    });
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.channel = null;
    this.connection = null;
  }
}

export const eventBus = new EventBus();
