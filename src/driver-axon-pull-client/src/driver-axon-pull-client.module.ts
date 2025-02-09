import { Module } from '@nestjs/common';
import { DriverAxonPullClientService } from './driver-axon-pull-client.service';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataAccessorService } from './metadata-accessor.service';
import { MetadataExplorerService } from './metadata-explorer.service';
import { Options } from './types';

@Module({
  providers: [DriverAxonPullClientService],
  exports: [DriverAxonPullClientService],
})
export class DriverAxonPullClientModule {
  static forRoot(options: Options) {
    return {
      global: true,
      module: DriverAxonPullClientModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        MetadataAccessorService,
        MetadataExplorerService,
        DriverAxonPullClientService,
      ],
      exports: [DriverAxonPullClientService],
    };
  }
}
