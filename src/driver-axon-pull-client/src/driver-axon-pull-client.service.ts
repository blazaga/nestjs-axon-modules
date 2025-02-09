/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as axon from 'axon';
import { Options, TMessage } from './types';

@Injectable()
export class DriverAxonPullClientService {
  @Inject('OPTIONS')
  private options: Options;

  private map = new Map<string, any>();
  private logger = new Logger(this.constructor.name);
  private sock = axon.socket('pull');

  onModuleInit() {
    this.sock.connect(this.options.server_port, this.options.server_address);
    this.logger.log('Worker-1 socket connected to port 3425');
    this.sock.on('message', this.onMessage.bind(this));
  }

  async onMessage(message: TMessage) {
    const tuple = this.map.get(message.type);

    if (!tuple) {
      this.logger.error(
        this.options.client_name +
          ' received unknown message type: ' +
          message.type,
      );
      return;
    }

    const [methodRef, instance] = tuple;

    await methodRef.call(instance, message);
  }

  registerHander(
    message_type: string,
    methodRef: FunctionConstructor,
    instance: any,
  ) {
    this.map.set(message_type, [methodRef, instance]);
  }
}
