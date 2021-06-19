import { ChildProcess, spawn } from 'child_process';
import { createServer, Server, Socket } from 'net';

import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { AssetPlayerSettings, ConnectionStatus } from '@stechy1/diplomka-share';

import {
  AssetPlayerAlreadyRunningException,
  AssetPlayerMainPathNotDefinedException,
  AssetPlayerModuleConfig,
  AssetPlayerNotRunningException,
  AssetPlayerPythonPathNotDefinedException,
  IpcAlreadyOpenException,
  IpcMessage,
  NoIpcOpenException
} from '@diplomka-backend/stim-feature-ipc/domain';

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

  private _server?: Server;
  private _serverSocket: Socket;
  private _assetPlayerProcess?: ChildProcess;
  private _connectedClientId?: string;

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

  private _handleMessage(buffer: Buffer) {
    this.eventBus.publish(new IpcMessageEvent(buffer));
  }

  private _handleKill(code?: number) {
    this.logger.verbose(`Přehrávač multimédií byl vypnut. {code}=${code}.`);
    this._assetPlayerProcess = undefined;
  }

  public spawn(config: AssetPlayerModuleConfig, settings: AssetPlayerSettings): void {
    if (!this._server) {
      throw new NoIpcOpenException();
    }

    if (!config.pythonPath) {
      throw new AssetPlayerPythonPathNotDefinedException();
    }

    if (!config.path) {
      throw new AssetPlayerMainPathNotDefinedException();
    }

    if (this._assetPlayerProcess) {
      throw new AssetPlayerAlreadyRunningException();
    }

    this.logger.verbose('Spouštím přehrávač multimédií.');
    // eslint-disable-next-line max-len
    this.logger.verbose(`${config.pythonPath} ${config.path} localhost ${config.communicationPort} ${settings.width} ${settings.height} ${config.frameRate} ${settings.fullScreen ? 1 : 0} ./output.log`);
    this._assetPlayerProcess = spawn(config.pythonPath, [
      config.path,
      'localhost',
      `${config.communicationPort}`,
      `${settings.width}`,
      `${settings.height}`,
      `${config.frameRate}`,
      `${settings.fullScreen ? 1 : 0}`,
      './output.log',
    ]);
    this._assetPlayerProcess?.on('close', (code) => this._handleKill(code));
    this._assetPlayerProcess?.stdout.pipe(process.stdout);
    this.logger.verbose('Přehrávač multimédií běží s PID: ' + this._assetPlayerProcess.pid);
  }

  public kill(): void {
    if (!this._assetPlayerProcess) {
      throw new AssetPlayerNotRunningException();
    }

    this.logger.verbose('Vypínám přehrávač multimédií.');
    this._assetPlayerProcess.kill('SIGKILL');
    this._handleKill();
  }

  public open(port: number): void {
    if (this._server) {
      throw new IpcAlreadyOpenException();
    }

    this.logger.verbose(`Vytvářím server pro IPC komunikaci na portu: ${port}.`);
    this._server = createServer((serverSocket: Socket) => {
      this._serverSocket = serverSocket;
      serverSocket.on('error', (err: { errno: string; code: string; syscall: string }) => this._handleError(err));
      serverSocket.on('data', (buffer: Buffer) => this._handleMessage(buffer));
    });
    this._server.on('close', () => this._handleClose());
    this._server.on('listening', () => this._handleListening());
    this._server.on('connection', (socket: Socket) => this._handleConnection(socket));

    this._server.listen(port);
    this.eventBus.publish(new IpcWasOpenEvent());
  }

  public close(): void {
    if (!this._server) {
      throw new NoIpcOpenException();
    }

    this._server?.close();
    this._server = undefined;
  }

  public send<T>(ipcMessage: IpcMessage<T>): void {
    if (!this._connectedClientId) {
      this.logger.error('Klient není připojený...');
      throw new NoIpcOpenException();
    }

    this.logger.verbose('Odesílám zprávu přes IPC: ');
    this.logger.verbose(ipcMessage);
    this._serverSocket.write(JSON.stringify(ipcMessage));
  }

  public get status(): ConnectionStatus {
    if (this._server) {
      if (this._assetPlayerProcess) {
        return ConnectionStatus.CONNECTED;
      }
      return ConnectionStatus.DISCONNECTED;
    }
    return ConnectionStatus.CLOSED;
  }
}
