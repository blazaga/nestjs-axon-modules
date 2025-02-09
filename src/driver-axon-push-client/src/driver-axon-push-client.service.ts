import { Injectable, Inject, Logger } from '@nestjs/common';
import * as axon from 'axon';
import { Message, Options } from './type';

@Injectable()
export class DriverAxonPushClientService {
  private logger = new Logger(this.constructor.name);
  private sock = axon.socket('push');

  @Inject('OPTIONS')
  private readonly options: Options;

  onModuleInit() {
    this.sock.connect(this.options.server_port, this.options.server_address);
    this.logger.log(
      `Orchestrator connected to ${this.options.server_address}:${this.options.server_port}`,
    );
  }

  async send<T>(message: Message<T>) {
    await this.sock.send({
      client_name: this.options.client_name,
      ...message,
    });
  }
}
