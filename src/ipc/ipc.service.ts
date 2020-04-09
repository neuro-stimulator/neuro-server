import { Injectable, Logger } from '@nestjs/common';
import { Server } from '@crussell52/socket-ipc';

import { IPC_PATH } from '../config/config';
import { Socket } from 'net';
import { ExperimentsService } from '../experiments/experiments.service';
import { FileBrowserService } from '../file-browser/file-browser.service';
import { SerialService } from '../low-level/serial.service';
import { TOPIC_ERROR, TOPIC_MULTIMEDIA, TOPIC_PING } from './protocol/ipc.protocol';
import { MessagePublisher } from '../share/utils';
import { IPC_STATUS } from './ipc.gateway.protocol';

@Injectable()
export class IpcService implements MessagePublisher {

  private readonly logger: Logger = new Logger(IpcService.name);

  private readonly _server: Server;

  private _connectedClientId: string;
  private _publishMessage: (topic: string, data: any) => void;

  constructor(private readonly _experiments: ExperimentsService,
              private readonly _serial: SerialService) {
    this._server = new Server({socketFile: IPC_PATH});
    this._server.on('error', err => this._handleError(err));
    this._server.on('close', () => this._handleClose());
    this._server.on('listening', () => this._handleListening());
    this._server.on('connection', (id: string, socket: Socket) => this._handleConnection(id, socket));
    this._server.on('message', (message: any, topic: string, id: string) => this._handleMessage(message, topic, id));

    this._server.listen();
  }

  private _handleError(err: any) {
    this.logger.error(err);
  }

  private _handleClose() {
    this.logger.verbose('Server ukončil IPC komunikaci...');
  }

  private _handleListening() {
    this.logger.log(`Server začal naslouchat pro IPC komunikaci na ceste: '${IPC_PATH}'`);
  }

  private _handleConnection(id: string, socket: Socket) {
    this.logger.verbose(`Server přijal nového klienta pro IPC komunikaci s ID: ${id}.`);
    this._publishMessage(IPC_STATUS, {connected: true});
    socket.on('end', () => {
      this.logger.debug(`Klient s ID: ${id} se odpojil.`);
      this._publishMessage(IPC_STATUS, {connected: false});
      this._connectedClientId = undefined;
    });
    this._connectedClientId = id;
  }

  private _handleMessage(message: any, topic: string, id: string) {
    switch (topic) {
      case TOPIC_PING:
        this._server.send('pong', {valid: message.version === 1, publicPath: FileBrowserService.mergePublicPath()}, id);
        break;
      case TOPIC_MULTIMEDIA:
        this._experiments.usedOutputMultimedia(message.id)
            .then(value => {
              this._server.send(TOPIC_MULTIMEDIA, value, id);
            });
        break;
      case TOPIC_ERROR:
        this.logger.error(message);
        // TODO zobrazit chybovou hlášku i u klienta
        break;
    }
  }

  public send(topic: string, message: any) {
    if (!this._connectedClientId) {
      this.logger.error('Klient není připojený...');
      return;
    }
    this.logger.debug('Odesílám zprávu přes IPC: ');
    this.logger.verbose({topic, message});
    this._server.send(topic, message, this._connectedClientId);
  }

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

  get isConnected() {
    return this._connectedClientId !== undefined;
  }
}
