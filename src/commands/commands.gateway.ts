import { Client, Server, Socket } from 'socket.io';

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { CommandClientToServer } from '@stechy1/diplomka-share';

import { SERVER_SOCKET_PORT } from '../config/config';
import { ExperimentsService } from '../experiments/experiments.service';
import { CommandsService } from './commands.service';

@WebSocketGateway(SERVER_SOCKET_PORT, {namespace: '/commands'})
export class CommandsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger: Logger = new Logger(CommandsGateway.name);

  private readonly commands: {[s: string]: (...data: any) => void} = {};

  @WebSocketServer()
  server: Server;

  constructor(private readonly _service: CommandsService,
              private readonly _experiments: ExperimentsService) {
    this.commands[CommandClientToServer.COMMAND_EXPERIMENT_START] = () => _service.runExperiment(_experiments.experimentResult.id);
    this.commands[CommandClientToServer.COMMAND_EXPERIMENT_PAUSE] = () => _service.pauseExperiment(_experiments.experimentResult.id);
    this.commands[CommandClientToServer.COMMAND_EXPERIMENT_FINISH] = () => _service.finishExperiment(_experiments.experimentResult.id);
    this.commands[CommandClientToServer.COMMAND_EXPERIMENT_UPLOAD] = async (experimentId: number) => {
      await this._service.uploadExperiment(experimentId);
    };
    this.commands[CommandClientToServer.COMMAND_EXPERIMENT_SETUP] = async (experimentID: number) => {
      await _service.setupExperiment(experimentID);
    };
    this.commands[CommandClientToServer.COMMAND_EXPERIMENT_CLEAR] = () =>  _service.clearExperiment();
    this.commands[CommandClientToServer.COMMAND_OUTPUT_SET] = (data: {index: number, brightness: number}) => _service.togleLed(data.index, data.brightness);
    this.commands[CommandClientToServer.COMMAND_MEMORY] = (memoryType: number) => _service.memoryRequest(memoryType);
    this.commands[CommandClientToServer.COMMAND_SEQUENCE_PART] = (data: {offset: number, index: number}) => _service.sendNextSequencePart(data.offset, data.index);

    _service.registerMessagePublisher((topic: string, data: any) => this._messagePublisher(topic, data));

    // this.commands[CommandClientToServer.COMMAND_DISPLAY_CLEAR] = buffers.bufferCommandDISPLAY_CLEAR;
    // this.commands[CommandClientToServer.COMMAND_DISPLAY_TEXT] = (data: any) => buffers.bufferCommandDISPLAY_SET(data.x, data.y, data.text);
  }

  private _messagePublisher(topic: string, data: any) {
    this.server.emit(topic, data);
  }

  handleConnection(client: Client, ...args: any[]): any {
    this.logger.verbose(`Klient ${client.id} navázal spojení...`);
  }

  handleDisconnect(client: Client): any {
    this.logger.verbose(`Klient ${client.id} ukončil spojení...`);
  }

  @SubscribeMessage('command')
  async handleCommand(client: Socket, message: {name: string, data: any}) {
    this.logger.debug(`Přišel nový command: '${message.name}'`);
    if (this.commands[message.name] === undefined) {
      this.logger.error('Příkaz nebyl rozpoznán!');
      client.emit('command', {valid: false, message: 'Příkaz nebyl rozpoznán!'});
    }

    try {
      await this.commands[message.name](message.data);
      client.emit('command', {valid: true});
    } catch (e) {
      client.emit('command', {valid: false, message: 'Příkaz se nepovedlo vykonat!'});
    }

  }

}
