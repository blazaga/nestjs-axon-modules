export type Message<T> = {
  type: string;
  client_name?: string;
  server_name?: string;
  payload: T;
};

export type Options = {
  server_port: number;
  server_address: string;
  server_name: string;
};
