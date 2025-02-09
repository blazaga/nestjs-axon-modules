import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class MetadataAccessorService {
  constructor(private readonly reflector: Reflector) {}

  getServiceType(target: typeof Function): any | undefined {
    return this.reflector.get('SERVICE_TYPE', target);
  }

  getMessageType(target: typeof Function): any | undefined {
    return this.reflector.get('MESSAGE_TYPE', target);
  }
}
