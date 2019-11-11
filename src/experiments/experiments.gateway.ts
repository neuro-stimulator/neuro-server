import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Client, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Experiment } from 'diplomka-share';
import { ExperimentsService } from './experiments.service';

@WebSocketGateway(3001, { namespace: '/experiments' })
export class ExperimentsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  private readonly logger = new Logger(ExperimentsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: ExperimentsService) {
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

  insert(experiment: Experiment) {
    this.server.emit('insert', experiment);
  }

  update(experiment: Experiment) {
    this.server.emit('update', experiment);
  }

  delete(experiment: Experiment) {
    this.server.emit('delete', experiment);
  }

  @SubscribeMessage('all')
  handleAll(client: any, message: any) {
    this._service.findAll()
        .then(experiments => {
          client.emit('all', experiments);
        });
  }
}
