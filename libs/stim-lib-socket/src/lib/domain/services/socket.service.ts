import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { SocketMessage } from '@stechy1/diplomka-share';

import { ClientConnectedEvent } from '../../application/events/impl/client-connected.event';
import { ClientDisconnectedEvent } from '../../application/events/impl/client-disconnected.event';
import { MessageArivedEvent } from '../../application/events/impl/message-arived.event';

@WebSocketGateway()
export class SocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(SocketService.name);

  private readonly clients: { [clientID: string]: Socket } = {};

  constructor(private readonly eventBus: EventBus) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any): any {
    this.logger.log('Socket server inicializován...');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
    this.clients[client.id] = client;
    this.eventBus.publish(new ClientConnectedEvent(client.id));
  }

  handleDisconnect(client: Socket): any {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
    delete this.clients[client.id];
    this.eventBus.publish(new ClientDisconnectedEvent(client.id));
  }

  @SubscribeMessage('command')
  public async handleCommand(client: Socket, message: SocketMessage) {
    this.eventBus.publish(new MessageArivedEvent(client.id, message));
  }

  public sendCommand(clidntID: string, message: SocketMessage) {
    this.logger.verbose(
      `Odesílám zprávu s obsahem: ${JSON.stringify(
        message
      )} klientovi: ${clidntID}`
    );
    this.clients[clidntID]?.emit('command', message);
  }

  public broadcastCommand(message: SocketMessage) {
    this.logger.verbose(
      'Broadcastuji zprávu všem připojeným webovým klientům.'
    );
    this.logger.verbose(message);
    this.server.emit('command', message);
  }
}
