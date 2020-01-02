import { Controller, Logger, Options, Param, Patch } from '@nestjs/common';

import { Experiment, createEmptyExperimentResult } from 'diplomka-share';

import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';
import * as buffers from './protocol/functions.protocol';
import { IpcService } from '../ipc/ipc.service';
import { TOPIC_EXPERIMENT_STATUS } from '../ipc/protocol/ipc.protocol';
import { CommandsService } from './commands.service';

@Controller('api/commands')
export class CommandsController {

  private readonly logger: Logger = new Logger(CommandsController.name);

  constructor(private readonly service: CommandsService) {
  }

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Patch('reboot')
  public rebootStimulator() {
    this.service.reboot();
  }

  @Patch('experiment/setup/:id')
  public async setupExperiment(@Param() params: {id: number}) {
    await this.service.setupExperiment(params.id);
  }

  @Patch('experiment/init')
  public initExperiment() {
    this.service.initExperiment();
  }

  @Patch('experiment/start/:id')
  public startExperiment(@Param() params: {id: number}) {
    this.service.startExperiment(params.id);
  }

  @Patch('experiment/stop/:id')
  public stopExperiment(@Param() params: {id: number}) {
    this.service.stopExperiment(params.id);
  }

  @Patch('experiment/clear')
  public clearExperiment() {
    this.service.clearExperiment();
  }

  // Mimo oficiální protokol
  // V budoucnu se odstraní
  @Patch('toggle-led/:index/:enabled')
  public toggleLed(@Param() params: {index: string, enabled: string}) {
    this.service.togleLed(+params.index, +params.enabled);
  }

}
