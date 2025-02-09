import { Module } from '@nestjs/common';
import { DriverAxonPushClientService } from './driver-axon-push-client.service';
import { Options } from './type';

@Module({
  providers: [],
  exports: [],
})
export class DriverAxonPushClientModule {
  static forRoot(options: Options) {
    return {
      global: true,
      module: DriverAxonPushClientModule,
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        DriverAxonPushClientService,
      ],
      exports: [DriverAxonPushClientService],
    };
  }
}
