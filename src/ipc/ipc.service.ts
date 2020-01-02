import { Injectable, Logger } from '@nestjs/common';
import { Server } from '@crussell52/socket-ipc';

import { IPC_PATH } from '../config/config';
import { Socket } from 'net';

@Injectable()
export class IpcService {

  private readonly logger: Logger = new Logger(IpcService.name);

  private readonly server: Server;

  constructor() {
    this.server = new Server({socketFile: IPC_PATH});
    this.server.on('error', err => this._handleError(err));
    this.server.on('close', () => this._handleClose());
    this.server.on('listening', () => this._handleListening());
    this.server.on('connection', (id: string, socket: Socket) => this._handleConnection(id, socket));
    this.server.on('message', (data) => this._handleMessage(data));

    this.server.listen();
  }

  private _handleError(err: any) {
    this.logger.error(err);
  }

  private _handleClose() {
    this.logger.log('Server ukončil IPC komunikaci...');
  }

  private _handleListening() {
    this.logger.log('Server začal naslouchat pro IPC komunikaci...');
  }

  private _handleConnection(id: string, socket: Socket) {
    this.logger.debug(`Server přijal nového klienta pro IPC komunikaci s ID: ${id}.`);
    this.server.send('test', {aaa: 'bbb'}, id);
  }

  private _handleMessage(data: any) {
    this.logger.debug(data);
  }
}
