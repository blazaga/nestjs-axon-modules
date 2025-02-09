import {
  PayloadTransformer,
  TMessage,
} from '../../../driver-axon-pull-client/src/types';
export function Payload<P = any, T = any>(...args: PayloadTransformer<P, T>[]) {
  return function (target: any, methodKey: string, parameterIndex: number) {
    const existingRequiredParameters: number[] =
      Reflect.getOwnMetadata('PAYLOAD', target, methodKey as any) || [];
    existingRequiredParameters.push(parameterIndex as any);

    Reflect.defineMetadata(
      'PAYLOAD',
      existingRequiredParameters,
      target,
      methodKey as any,
    );

    Reflect.defineMetadata('PAYLOAD_ARGS', args, target, methodKey as any);
  };
}

export const handlerPayloadParameterDecorator = async (
  args: Array<any>,
  message: TMessage,
  target,
  methodKey: string,
) => {
  const meta_key = 'PAYLOAD';
  const meta_args = 'PAYLOAD_ARGS';
  const parameterIndices: number[] = Reflect.getOwnMetadata(
    meta_key,
    target,
    methodKey,
  );

  if (parameterIndices === undefined) return args;

  const transformers: PayloadTransformer<any>[] = Reflect.getOwnMetadata(
    meta_args,
    target,
    methodKey,
  );

  for (const parm of parameterIndices) {
    let new_arg = message.payload;
    for (const transformer of transformers) {
      new_arg = await transformer(new_arg);
    }

    args[parm] = new_arg;
  }
  return [];
};
