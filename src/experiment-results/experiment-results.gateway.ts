import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Client, Server } from 'socket.io';
import { ExperimentResult } from 'diplomka-share';

import { SERVER_SOCKET_PORT } from '../config/config';
import { ExperimentResultsService } from './experiment-results.service';

@WebSocketGateway(SERVER_SOCKET_PORT, { namespace: '/experiment-results' })
export class ExperimentResultsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(ExperimentResultsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: ExperimentResultsService) {
    _service.registerMessagePublisher((topic: string, data: any) => this._messagePublisher(topic, data));
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  }

  handleDisconnect(client: Client): any {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

}
