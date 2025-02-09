import { Module } from '@nestjs/common';
import { DriverAxonPushServerService } from './driver-axon-push-server.service';
import { Options } from './types';

@Module({})
export class DriverAxonPushServerModule {
  static forRoot(options: Options) {
    return {
      global: true,
      module: DriverAxonPushServerModule,
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        DriverAxonPushServerService,
      ],
      exports: [DriverAxonPushServerService],
    };
  }
}
