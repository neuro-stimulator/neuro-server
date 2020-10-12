import { createServer, Server, Socket } from 'net';

import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { IpcAlreadyConnectedException } from '../../domain/exception/ipc-already-connected.exception';
import { NoIpcOpenException } from '../../domain/exception/no-ipc-open.exception';
import { IpcMessage } from '../../domain/model/ipc-message';
import { IpcErrorEvent } from '../event/impl/ipc-error.event';
import { IpcClosedEvent } from '../event/impl/ipc-closed.event';
import { IpcListeningEvent } from '../event/impl/ipc-listening.event';
import { IpcDisconnectedEvent } from '../event/impl/ipc-disconnected.event';
import { IpcConnectedEvent } from '../event/impl/ipc-connected.event';
import { IpcMessageEvent } from '../event/impl/ipc-message.event';
import { IpcWasOpenEvent } from '../event/impl/ipc-was-open.event';

@Injectable()
export class IpcService {
  private readonly logger: Logger = new Logger(IpcService.name);

  private _server: Server;
  private _serverSocket: Socket;

  private _connectedClientId: string;

  constructor(private readonly eventBus: EventBus) {}

  private _handleError(err: { errno: string; code: string; syscall: string }) {
    if ('ECONNRESET' === err.errno) {
      // Spadlo spojení od IPC klienta
      this._handleDisconnected();
      return;
    }

    this.eventBus.publish(new IpcErrorEvent(err));
  }

  private _handleClose() {
    this.eventBus.publish(new IpcClosedEvent());
  }

  private _handleListening() {
    this.eventBus.publish(new IpcListeningEvent());
  }

  private _handleDisconnected() {
    const clientID = this._connectedClientId;
    this._connectedClientId = undefined;
    this.eventBus.publish(new IpcDisconnectedEvent(clientID));
  }

  private _handleConnection(socket: Socket) {
    socket.on('end', () => this._handleDisconnected());
    this._connectedClientId = JSON.stringify(socket.address());
    this.eventBus.publish(new IpcConnectedEvent(this._connectedClientId));
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

  public open() {
    if (this._server) {
      throw new IpcAlreadyConnectedException();
    }

    this._server = createServer((serverSocket: Socket) => {
      this._serverSocket = serverSocket;
      serverSocket.on('error', (err: any) => this._handleError(err));
    });
    this._server.on('close', () => this._handleClose());
    this._server.on('listening', () => this._handleListening());
    this._server.on('connection', (socket: Socket) => this._handleConnection(socket));
    this._server.on('data', (message: any, topic: string, id: string) => this._handleMessage(message, topic, id));

    this._server.listen(8080);
    this.eventBus.publish(new IpcWasOpenEvent());
  }

  public close() {
    if (!this._server) {
      throw new NoIpcOpenException();
    }

    this._server.close();
    this._server = undefined;
  }

  public send(ipcMessage: IpcMessage<any>) {
    if (!this._connectedClientId) {
      this.logger.error('Klient není připojený...');
      throw new NoIpcOpenException();
    }

    this.logger.debug('Odesílám zprávu přes IPC: ');
    this.logger.verbose(ipcMessage);
    this._serverSocket.write(JSON.stringify(ipcMessage));
  }

  public get isConnected() {
    return this._connectedClientId !== undefined;
  }
}
