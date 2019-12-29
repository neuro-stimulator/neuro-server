import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Client, Server } from 'socket.io';

import { SERVER_SOCKET_PORT } from '../config/config';

@WebSocketGateway(SERVER_SOCKET_PORT, { namespace: '/serial' })
export class SerialGateway implements OnGatewayConnection {

  private readonly logger = new Logger(SerialGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.log('Klient se přihlásil na seriovou komunikaci');
  }

  sendData(data: any) {
    this.server.emit('data', data);
  }

  updateStatus(status: any) {
    this.server.emit('status', status);
  }
}
