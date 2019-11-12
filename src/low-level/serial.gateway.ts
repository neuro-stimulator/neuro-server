import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001, { namespace: '/serial' })
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
}
