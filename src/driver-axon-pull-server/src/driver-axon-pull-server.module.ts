import { Module } from '@nestjs/common';
import { DriverAxonPullServerService } from './driver-axon-pull-server.service';
import { DiscoveryModule } from '@nestjs/core';
import { MetadataAccessorService } from './metadata-accessor.service';
import { MetadataExplorerService } from './metadata-explorer.service';
import { Options } from './types';

@Module({
  providers: [],
  exports: [],
})
export class DriverAxonPullServerModule {
  static forRoot(options: Options) {
    return {
      global: true,
      module: DriverAxonPullServerModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: 'OPTIONS',
          useValue: options,
        },
        MetadataAccessorService,
        MetadataExplorerService,
        DriverAxonPullServerService,
      ],
      exports: [DriverAxonPullServerService],
    };
  }
}
