import {
  TMessage,
  MessageTransformer,
} from '../../../driver-axon-pull-client/src/types';

export function Message(...args: MessageTransformer<any>[]) {
  return function (target: any, methodKey: string, parameterIndex: number) {
    const existingRequiredParameters: number[] =
      Reflect.getOwnMetadata('META_MESSAGE', target, methodKey as any) || [];
    existingRequiredParameters.push(parameterIndex as any);

    Reflect.defineMetadata(
      'META_MESSAGE',
      existingRequiredParameters,
      target,
      methodKey as any,
    );

    Reflect.defineMetadata('META_MESSAGE_ARGS', args, target, methodKey as any);
  };
}

export const handleMessageParamDecorator = async (
  args: Array<any>,
  message: TMessage,
  target,
  methodKey: string,
) => {
  const meta_key = 'META_MESSAGE';
  const meta_args = 'META_MESSAGE_ARGS';
  const parameterIndices: number[] = Reflect.getOwnMetadata(
    meta_key,
    target,
    methodKey,
  );
  if (parameterIndices === undefined) return args;

  const transformers: MessageTransformer<any>[] = Reflect.getOwnMetadata(
    meta_args,
    target,
    methodKey,
  );

  for (const parm of parameterIndices) {
    let new_arg = message;
    for (const transformer of transformers) {
      new_arg = await transformer(new_arg);
    }

    args[parm] = new_arg;
  }
  return [];
};
