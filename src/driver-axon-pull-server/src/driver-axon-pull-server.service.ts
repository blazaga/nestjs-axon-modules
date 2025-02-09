import { Inject, Injectable, Logger } from '@nestjs/common';
import * as axon from 'axon';
import { Options, TMessage } from './types';

@Injectable()
export class DriverAxonPullServerService {
  private logger = new Logger(this.constructor.name);
  @Inject('OPTIONS')
  private readonly options: Options;

  private pull = axon.socket('pull');
  private map = new Map<string, any>();

  onModuleInit() {
    this.pull.bind(this.options.server_port, this.options.server_address);
    this.pull.on('message', this.onMessage.bind(this));
  }

  async onMessage(message: TMessage) {
    const handler = this.map.get(message.type);
    if (!handler) {
      this.logger.error(`No handler for message type ${message.type}`);
      return;
    }
    const [methodRef, instance] = handler;
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
