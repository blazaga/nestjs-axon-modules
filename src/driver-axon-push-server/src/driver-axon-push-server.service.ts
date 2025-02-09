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
}
