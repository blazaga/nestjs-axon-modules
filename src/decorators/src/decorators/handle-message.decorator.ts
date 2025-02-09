import { SetMetadata, applyDecorators } from '@nestjs/common';
import { handleMessageParamDecorator } from './message.decorator';
import { handlerPayloadParameterDecorator } from './payload.decorator';

const parameterDecoratorHandlers = [
  handleMessageParamDecorator,
  handlerPayloadParameterDecorator,
];

export function HandleMessage(type: string) {
  return applyDecorators(
    function (target: any, methodKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const originalMessage = Object.assign({}, { ...args[0] });
        for (const handler of parameterDecoratorHandlers) {
          await handler(args, originalMessage, target, methodKey);
        }
        return originalMethod.apply(this, args);
      };
      return descriptor;
    },
    SetMetadata('SERVICE_TYPE', 'HANDLER'),
    SetMetadata('MESSAGE_TYPE', type),
  );
}
