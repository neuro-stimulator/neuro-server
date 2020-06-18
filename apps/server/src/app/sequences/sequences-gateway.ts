// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
//
// import { Client, Server } from 'socket.io';
//
// import { Sequence } from '@stechy1/diplomka-share';
//
// import { ExperimentsService } from 'libs/stim-feature-experiments/src/lib/domain/services/experiments.service';
// import { SequencesService } from 'libs/stim-feature-sequences/src/lib/domain/services/sequences.service';
//
// @WebSocketGateway({ namespace: '/sequence' })
// export class SequencesGateway {
//   private readonly logger: Logger = new Logger(SequencesGateway.name);
//
//   @WebSocketServer()
//   server: Server;
//
//   constructor(
//     private readonly _service: SequencesService,
//     private readonly _experiments: ExperimentsService
//   ) {
//     _service.registerMessagePublisher((topic: string, data: any) =>
//       this._messagePublisher(topic, data)
//     );
//   }
//
//   private _messagePublisher(topic: string, data: any) {
//     this.server.emit(topic, data);
//   }
//
//   handleConnection(client: Client, ...args: any[]): any {
//     this.logger.verbose(`Klient ${client.id} navázal spojení...`);
//   }
//
//   handleDisconnect(client: Client): any {
//     this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
//   }
//
//   @SubscribeMessage('all')
//   handleAll(client: any, message: any) {
//     this._service.findAll().then((experiments: Sequence[]) => {
//       client.emit('all', experiments);
//     });
//   }
// }
