import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Client, Server } from 'socket.io';

import { SerialService } from 'backup/low-level/serial.service';

@WebSocketGateway({ namespace: '/serial' })
export class SerialGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SerialGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: SerialService) {
    _service.registerMessagePublisher((topic: string, data: any) =>
      this._messagePublisher(topic, data)
    );
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
    this._service.tryAutoopenComPort();
  }

  handleDisconnect(client: Client): any {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  }
}
