declare module '@crussell52/socket-ipc' {
  import EventEmitter = NodeJS.EventEmitter;

  export interface ServerOptions {
    transcoder?: any;
    socketFile: string;

  }

  export class Server extends EventEmitter {
    constructor( options: ServerOptions);

    listen(): void;
    close(): void;
    broadcast(topic: string, message: any);
    send(topic: string, message: any, clientId: string);
  }

  export interface ClientOptions {
    transcoder?: any;
    retryDelay?: number;
    reconnectDelay?: number;
    socketFile: string;
  }

  export class Client extends EventEmitter {
    constructor(options: ClientOptions);

    close(): void;
    send(topic: string, message: any): void;
  }
}
