import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { SocketMessage } from '@stechy1/diplomka-share';

import { ClientConnectedEvent } from '../../application/events/impl/client-connected.event';
import { ClientDisconnectedEvent } from '../../application/events/impl/client-disconnected.event';
import { MessageArivedEvent } from '../../application/events/impl/message-arived.event';

@WebSocketGateway()
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(SocketService.name);

  private readonly clients: { [clientID: string]: Socket } = {};

  constructor(private readonly eventBus: EventBus) {}

  @WebSocketServer()
  server: Server;

  afterInit(): void {
    this.logger.log('Socket server inicializován...');
  }

  handleConnection(client: Socket): void {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
    this.clients[client.id] = client;
    this.eventBus.publish(new ClientConnectedEvent(client.id));
  }

  handleDisconnect(client: Socket): void {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
    delete this.clients[client.id];
    this.eventBus.publish(new ClientDisconnectedEvent(client.id));
  }

  @SubscribeMessage('command')
  public handleCommand(client: Socket, message: SocketMessage): void {
    this.logger.verbose(`Přišla zpráva z klienta: '${JSON.stringify(message)}'.`);
    this.eventBus.publish(new MessageArivedEvent(client.id, message));
  }

  public sendCommand(clidntID: string, message: SocketMessage): void {
    this.logger.verbose(`Odesílám zprávu s obsahem: ${JSON.stringify(message)} klientovi: ${clidntID}`);
    this.clients[clidntID]?.emit('command', message);
  }

  public broadcastCommand(message: SocketMessage): void {
    this.logger.verbose('Broadcastuji zprávu všem připojeným webovým klientům.');
    this.logger.verbose(message);
    this.server.emit('command', message);
  }
}
