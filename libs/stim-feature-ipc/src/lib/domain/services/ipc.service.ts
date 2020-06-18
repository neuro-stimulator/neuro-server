import { Socket } from 'net';

import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { Server } from '@crussell52/socket-ipc';

import {
  IpcOpenEvent,
  IpcListeningEvent,
  IpcClosedEvent,
  IpcConnectedEvent,
  IpcDisconnectedEvent,
  IpcMessageEvent,
  IpcErrorEvent,
} from '../../application/event';
import { IpcAlreadyConnectedError, NoIpcOpenError } from '../exception';

@Injectable()
export class IpcService {
  private readonly logger: Logger = new Logger(IpcService.name);

  private _server: Server;

  private _connectedClientId: string;

  constructor(private readonly eventBus: EventBus) {}

  private _handleError(err: any) {
    this.eventBus.publish(new IpcErrorEvent(err));
  }

  private _handleClose() {
    this.eventBus.publish(new IpcClosedEvent());
  }

  private _handleListening() {
    this.eventBus.publish(new IpcListeningEvent());
  }

  private _handleConnection(id: string, socket: Socket) {
    socket.on('end', () => {
      this._connectedClientId = undefined;
      this.eventBus.publish(new IpcDisconnectedEvent(id));
    });
    this._connectedClientId = id;
    this.eventBus.publish(new IpcConnectedEvent(id));
  }

  private _handleMessage(message: any, topic: string, id: string) {
    this.eventBus.publish(new IpcMessageEvent(message, topic, id));
    //   switch (topic) {
    //     case TOPIC_PING:
    //       this._server.send(
    //         'pong',
    //         {
    //           valid: message.version === 1,
    //           publicPath: '' /*this._fileBrowser.mergePublicPath()*/,
    //         },
    //         id
    //       );
    //       break;
    //     case TOPIC_MULTIMEDIA:
    //       this._experiments
    //         .usedOutputMultimedia(message.id)
    //         .then((value: { audio: {}; image: {} }) => {
    //           this._server.send(TOPIC_MULTIMEDIA, value, id);
    //         });
    //       break;
    //     case TOPIC_ERROR:
    //       this.logger.error(message);
    //       // TODO zobrazit chybovou hlášku i u klienta
    //       break;
    //   }
  }

  public open(path: string) {
    if (this._server) {
      throw new IpcAlreadyConnectedError();
    }

    this._server = new Server({ socketFile: path });
    this._server.on('error', (err) => this._handleError(err));
    this._server.on('close', () => this._handleClose());
    this._server.on('listening', () => this._handleListening());
    this._server.on('connection', (id: string, socket: Socket) =>
      this._handleConnection(id, socket)
    );
    this._server.on('message', (message: any, topic: string, id: string) =>
      this._handleMessage(message, topic, id)
    );

    this._server.listen();
    this.eventBus.publish(new IpcOpenEvent());
  }

  public close() {
    if (!this._server) {
      throw new NoIpcOpenError();
    }

    this._server.close();
    this._server = undefined;
  }

  public send(topic: string, message: any) {
    if (!this._connectedClientId) {
      this.logger.error('Klient není připojený...');
      throw new NoIpcOpenError();
    }
    this.logger.debug('Odesílám zprávu přes IPC: ');
    this.logger.verbose({ topic, message });
    this._server.send(topic, message, this._connectedClientId);
  }

  get isConnected() {
    return this._connectedClientId !== undefined;
  }
}
