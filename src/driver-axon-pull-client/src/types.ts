export type TMessage<T = any> = {
  type: string;
  client_name?: string;
  server_name?: string;
  payload: T;
};

export type MessageTransformer<T = any> = (message: TMessage) => T | Promise<T>;

export type PayloadTransformer<PT = any, T = any> = (
  payload: PT,
) => T | Promise<T>;

export type Options = {
  server_port: number;
  server_address: string;
  client_name: string;
};
