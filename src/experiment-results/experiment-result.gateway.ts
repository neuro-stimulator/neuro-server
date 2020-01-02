import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Server } from 'socket.io';
import { ExperimentResult } from 'diplomka-share';

import { SERVER_SOCKET_PORT } from '../config/config';
import { ExperimentResultsService } from './experiment-results.service';

@WebSocketGateway(SERVER_SOCKET_PORT, { namespace: '/experiment-result' })
export class ExperimentResultGateway {

  private readonly logger = new Logger(ExperimentResultGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: ExperimentResultsService) {
    _service.registerMessagePublisher(this._messagePublisher);
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

  insert(experiment: ExperimentResult) {
    this.server.emit('insert', experiment);
  }

  update(experiment: ExperimentResult) {
    this.server.emit('update', experiment);
  }

  delete(experiment: ExperimentResult) {
    this.server.emit('delete', experiment);
  }

}
