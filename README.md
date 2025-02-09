# NestJS Axon Modules

## Description

This is a collection of modules for NestJS that provide support for Axon Framework.

## Features

- [x] Server Push Driver
- [x] Server Pull Driver
- [x] Client Push Driver
- [x] Client Pull Driver
- [ ] Server Publish Driver
- [ ] Server Subscribe Driver
- [ ] Client Publish Driver
- [ ] Client Subscribe Driver
- [ ] Server Request Driver
- [ ] Server Response Driver
- [ ] Client Request Driver
- [ ] Client Response Driver

## Installation

```bash
pnpm install nestjs-axon-modules
```

## Usage

### Server Push Driver

```ts
import { Module } from '@nestjs/common';
import { Worker2Service } from './worker-2.service';
import { DriverAxonPushServerModule } from 'nestjs-axon-modules';

@Injectable()
export class Service1 {
  constructor(private readonly push_driver: DriverAxonPushServerService) {}
  async send() {
    await this.push_driver.send({
      type: 'MESSAGE',
      payload: {
        message: 'Hello World',
      },
    });
  }
}

@Module({
  imports: [
    DriverAxonPushServerModule.forRoot({
      server_name: 'server-1',
      server_address: 'localhost',
      server_port: 3425,
    }),
  ],
  controllers: [],
  providers: [Service1],
})
export class AppModule {}
```

### Client Pull Driver

```ts
import { Module } from '@nestjs/common';
import { Worker2Service } from './worker-2.service';
import {
  DriverAxonPullClientModule,
  HandleMessage,
  Message,
} from 'nestjs-axon-modules';

@Injectable()
export class Service1 {
  constructor(private readonly push_driver: DriverAxonPushServerService) {}

  @HandleMessage('MESSAGE')
  async handle(@Message() message: any) {
    console.log(message);
  }
}

@Module({
  imports: [
    DriverAxonPullClientModule.forRoot({
      client_name: 'client-1',
      server_address: 'localhost',
      server_port: 3425,
    }),
  ],
  controllers: [],
  providers: [Service1],
})
export class AppModule {}
```

### Server Pull Driver

```ts
import { Module } from '@nestjs/common';
import { Worker2Service } from './worker-2.service';
import {
  DriverAxonPullServerModule,
  HandleMessage,
  Message,
} from 'nestjs-axon-modules';

@Injectable()
export class Service1 {
  constructor(private readonly push_driver: DriverAxonPushServerService) {}

  @HandleMessage('MESSAGE')
  async handle(@Message() message: any) {
    console.log(message);
  }
}

@Module({
  imports: [
    DriverAxonPullServerModule.forRoot({
      server_name: 'server-1',
      server_address: 'localhost',
      server_port: 3425,
    }),
  ],
  controllers: [],
  providers: [Service1],
})
export class AppModule {}
```

### Client Push Driver

```ts
import { Module } from '@nestjs/common';
import { Worker2Service } from './worker-2.service';
import { DriverAxonPushClientModule } from 'nestjs-axon-modules';

@Injectable()
export class Service1 {
  constructor(private readonly push_driver: DriverAxonPushServerService) {}
  async send() {
    await this.push_driver.send({
      type: 'MESSAGE',
      payload: {
        message: 'Hello World',
      },
    });
  }
}

@Module({
  imports: [
    DriverAxonPushClientModule.forRoot({
      client_name: 'server-1',
      server_address: 'localhost',
      server_port: 3425,
    }),
  ],
  controllers: [],
  providers: [Service1],
})
export class AppModule {}
```

### Decorators

#### @HandleMessage(message_type: string)

This method decorator is used to handle messages. Only handles messages of the specified type.

Used in conjunction with the `@Message` method decorator.

e.g.

```ts
@HandleMessage('MESSAGE')
async handle(@Message() message: TMessage) {
  console.log(message);
}
```

#### @Message()

This parameter decorator is used to get the message.

Used in conjunction with the `@HandleMessage` method decorator.

e.g.

```ts
@HandleMessage('MESSAGE')
async handle(@Message() message: any) {
  console.log(message);
}
```

#### @Payload()

This parameter decorator is used to get the payload of the message.

Used in conjunction with the `@HandleMessage` method decorator.

e.g.

```ts
@HandleMessage('MESSAGE')
async handle(@Payload() payload: any) {
  console.log(payload);
}
```
