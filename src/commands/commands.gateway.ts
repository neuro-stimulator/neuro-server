import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Client } from 'socket.io';

import { Experiment } from '@stechy1/diplomka-share';

import { SERVER_SOCKET_PORT } from '../config/config';
import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';
import * as buffers from './protocol/functions.protocol';
import { CommandsService } from './commands.service';

@WebSocketGateway(SERVER_SOCKET_PORT, {namespace: '/commands'})
export class CommandsGateway {

  private readonly commands: {[s: string]: (...data: any) => void} = {};

  constructor(private readonly _service: CommandsService,
              private readonly _experiments: ExperimentsService) {
    this.commands['reboot'] = _service.reboot;
    this.commands['experiment-setup'] = async (experimentID: number) => {
      await _service.setupExperiment(experimentID);
    };
    this.commands['experiment-init'] = _service.initExperiment;
    this.commands['experiment-start'] = () => _service.startExperiment(_experiments.experimentResult.id);
    this.commands['experiment-stop'] = () => _service.stopExperiment(_experiments.experimentResult.id);
    this.commands['experiment-clear'] = _service.clearExperiment;
    this.commands['output-set'] = (data: any) => _service.togleLed(data.index, data.brightness);

    // this.commands['reboot'] = buffers.bufferCommandREBOOT;
    // this.commands['set-time'] = (time: number) => buffers.bufferCommandTIME_SET(time);
    // this.commands['display-clear'] = buffers.bufferCommandDISPLAY_CLEAR;
    // this.commands['display-text'] = (data: any) => buffers.bufferCommandDISPLAY_SET(data.x, data.y, data.text);
    // this.commands['experiment-setup'] = async (experimentID: number) => {
    //   const experiment: Experiment = await _experiments.byId(experimentID);
    //   return buffers.bufferCommandEXPERIMENT_SETUP(experiment);
    // };
    // this.commands['experiment-init'] = buffers.bufferCommandINIT_EXPERIMENT;
    // this.commands['experiment-start'] = () => buffers.bufferCommandMANAGE_EXPERIMENT(true);
    // this.commands['experiment-stop'] = () => buffers.bufferCommandMANAGE_EXPERIMENT(false);
    // this.commands['experiment-clear'] = buffers.bufferCommandCLEAR_EXPERIMENT;
    // this.commands['output-set'] = (data: any) => buffers.bufferCommandBACKDOOR_1(data.index, data.brightness);
  }

  @SubscribeMessage('command')
  async handleCommand(client: Client, message: {name: string, data: any}) {
    if (this.commands[message.name] === undefined) {
      return {valid: false, message: 'Přikaz není podporovaný!'};
    }

    try {
      await this.commands[message.name]();
      return {valid: true};
    } catch (e) {
      return {valid: false, message: 'Příkaz se nepovedlo vykonat!'};
    }

  }

}
