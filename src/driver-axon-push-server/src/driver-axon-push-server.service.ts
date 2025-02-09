import { Inject, Injectable, Logger } from '@nestjs/common';
import * as axon from 'axon';
import { Message, Options } from './types';

@Injectable()
export class DriverAxonPushServerService {
  @Inject('OPTIONS') private readonly options: Options;
  private logger = new Logger(this.constructor.name);
  private sock = axon.socket('push');
  private interval: any;
  private counter = 0;

  onModuleInit() {
    this.sock.bind(this.options.server_port, this.options.server_address);
    this.logger.log(
      `Orchestrator started on ${this.options.server_address}:${this.options.server_port}`
    );
    this.interval = setInterval(this.run.bind(this), 1000);
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  send<T = any>(message: Message<T>) {
    this.sock.send({
      server_name: this.options.server_name,
      ...message,
    });
  }

  run() {
    const count = this.counter++;
    this.logger.log('Sending heartbeat ' + count);
    this.sock.send({
      type: 'HEARTBEAT',
      payload: {
        date: new Date().toISOString(),
        count,
      },
    });
  }
}
