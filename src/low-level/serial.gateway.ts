import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Client, Server } from 'socket.io';

import { SERVER_SOCKET_PORT } from '../config/config';
import { SerialService } from './serial.service';

@WebSocketGateway(SERVER_SOCKET_PORT, { namespace: '/serial' })
export class SerialGateway implements OnGatewayConnection {

  private readonly logger = new Logger(SerialGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: SerialService) {
    _service.registerMessagePublisher(this._messagePublisher);
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.log('Klient se přihlásil na seriovou komunikaci');
  }
}
