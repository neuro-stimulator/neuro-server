import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Client, Server} from 'socket.io';

import { Experiment } from 'diplomka-share';

import { SERVER_SOCKET_PORT } from '../config/config';
import { ExperimentsService } from './experiments.service';

@WebSocketGateway(SERVER_SOCKET_PORT, { namespace: '/experiments' })
export class ExperimentsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  private readonly logger = new Logger(ExperimentsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: ExperimentsService) {
    _service.registerMessagePublisher((topic: string, data: any) => this._messagePublisher(topic, data));
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

  afterInit(server: Server): any {
    this.logger.log('Websocket server pro experimenty naslouchá na portu: 3001.');
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  }

  handleDisconnect(client: Client): any {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  }

  @SubscribeMessage('all')
  handleAll(client: any, message: any) {
    this._service.findAll()
        .then(experiments => {
          client.emit('all', experiments);
        });
  }
}
