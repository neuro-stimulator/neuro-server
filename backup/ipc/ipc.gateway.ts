import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
//
// import { Client, Server } from 'socket.io';
//
// import { IpcService } from "./ipc.service";

// @WebSocketGateway({ namespace: '/ipc'})
export class IpcGateway /* implements OnGatewayConnection, OnGatewayDisconnect*/ {
  //
  // private readonly logger = new Logger(IpcGateway.name);
  //
  // @WebSocketServer()
  // server: Server;
  //
  // constructor(private readonly _service: IpcService) {
  //   this._service.registerMessagePublisher((topic: string, data: any) => this._messagePublisher(topic, data));
  // }
  //
  // private _messagePublisher(topic: string, data: any) {
  //   this.server.emit(topic, data);
  // }
  //
  // handleConnection(client: Client, ...args: any[]): any {
  //   this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  // }
  //
  // handleDisconnect(client: Client): any {
  //   this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  // }
}
