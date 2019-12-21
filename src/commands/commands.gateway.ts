import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Client } from 'socket.io';

import { Experiment } from 'diplomka-share';

import * as buffers from './protocol/functions.protocol';
import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';


@WebSocketGateway(3001, {namespace: '/commands'})
export class CommandsGateway {

  private readonly commands: {[s: string]: (...data: any) => Buffer|Promise<Buffer>} = {};

  constructor(private readonly _serial: SerialService,
              private readonly _experiments: ExperimentsService) {
    this.commands['reboot'] = buffers.bufferCommandREBOOT;
    this.commands['set-time'] = (time: number) => buffers.bufferCommandTIME_SET(time);
    this.commands['display-clear'] = buffers.bufferCommandDISPLAY_CLEAR;
    this.commands['display-text'] = (data: any) => buffers.bufferCommandDISPLAY_SET(data.x, data.y, data.text);
    this.commands['experiment-upload'] = async (experimentID: number) => {
      const experiment: Experiment = await _experiments.byId(experimentID);
      return buffers.bufferCommandEXPERIMENT_SETUP(experiment);
    };
    this.commands['experiment-init'] = buffers.bufferCommandINIT_EXPERIMENT;
    this.commands['experiment-start'] = () => buffers.bufferCommandMANAGE_EXPERIMENT(true);
    this.commands['experiment-stop'] = () => buffers.bufferCommandMANAGE_EXPERIMENT(false);
    this.commands['experiment-clear'] = buffers.bufferCommandCLEAR_EXPERIMENT;
    this.commands['output-set'] = (data: any) => buffers.bufferCommandBACKDOOR_1(data.index, data.brightness);
  }

  @SubscribeMessage('command')
  async handleCommand(client: Client, message: {name: string, data: any}) {
    if (this.commands[message.name] === undefined) {
      return {valid: false, message: 'Přikaz není podporovaný!'};
    }

    try {
      const buffer = await this.commands[message.name](message.data);
      this._serial.write(buffer);
      return {valid: true};
    } catch (e) {
      return {valid: false, message: 'Příkaz se nepovedlo vykonat!'};
    }

  }

}