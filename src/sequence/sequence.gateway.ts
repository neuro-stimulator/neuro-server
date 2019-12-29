import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Client, Server, Socket } from 'socket.io';

import { ExperimentERP } from 'diplomka-share';

import { SERVER_SOCKET_PORT } from '../config/config';
import { ExperimentsService } from '../experiments/experiments.service';
import { SequenceService } from './sequence.service';

@WebSocketGateway(SERVER_SOCKET_PORT, { namespace: '/sequence'})
export class SequenceGateway {

  private readonly logger: Logger = new Logger(SequenceGateway.name);

  constructor(private readonly _service: SequenceService,
              private readonly _experiments: ExperimentsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  }

  @SubscribeMessage('new-for-experiment')
  async handleEvent(@MessageBody() data: { id: number, sequenceSize: number },
                    @ConnectedSocket() client: Socket) {
    this.logger.log(`Budu generovat novou sekvenci o délce: ${data.sequenceSize} pro experiment s id: ${data.id}`);
    const experiment = await this._experiments.byId(data.id);

    const [sequence, analyse] = await this._service.newErpSequence(experiment as ExperimentERP, data.sequenceSize,
      (progress) => {
      client.emit('progress', {progress});
      });

    client.emit('new-for-experiment', {experiment, sequence, analyse});
  }


}
