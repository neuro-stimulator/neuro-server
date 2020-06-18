import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Client, Server } from 'socket.io';

import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsService } from 'libs/stim-feature-experiments/src/lib/domain/services/experiments.service';

@WebSocketGateway({ namespace: '/experiments' })
export class ExperimentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ExperimentsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: ExperimentsService) {
    // _service.registerMessagePublisher((topic: string, data: any) => this._messagePublisher(topic, data));
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  }

  handleDisconnect(client: Client): any {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  }

  @SubscribeMessage('all')
  handleAll(client: any, message: any) {
    this._service.findAll().then((experiments: Experiment[]) => {
      client.emit('all', experiments);
    });
  }
}
