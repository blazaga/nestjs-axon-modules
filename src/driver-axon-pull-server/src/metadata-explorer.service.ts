import { Injectable } from '@nestjs/common';
import { MetadataAccessorService } from './metadata-accessor.service';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { DriverAxonPullServerService } from './driver-axon-pull-server.service';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export class MetadataExplorerService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: MetadataAccessorService,
    private readonly metadataScanner: MetadataScanner,
    private readonly orchestrator: DriverAxonPullServerService,
  ) {}

  async onModuleInit() {
    await this.explore();
  }

  private async explore() {
    const instanceWrappers: InstanceWrapper[] = [
      ...this.discoveryService.getControllers(),
      ...this.discoveryService.getProviders(),
    ];

    instanceWrappers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;

      if (!instance || !Object.getPrototypeOf(instance)) {
        return;
      }

      this.metadataScanner.getAllMethodNames(instance).forEach((methodKey) => {
        this.lookupHandler(instance, methodKey);
      });
    });
  }

  private async lookupHandler(
    instance: Record<string, typeof Function>,
    key: string,
  ) {
    const methodRef = instance[key];

    const service_type = this.metadataAccessor.getServiceType(methodRef);
    if (!service_type) {
      return;
    }

    const message_type = this.metadataAccessor.getMessageType(methodRef);

    this.orchestrator.registerHander(message_type, methodRef, instance);
  }
}
