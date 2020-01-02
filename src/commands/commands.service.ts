import { Injectable, Logger } from '@nestjs/common';

import { Experiment, createEmptyExperimentResult } from 'diplomka-share';

import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';
import { IpcService } from '../ipc/ipc.service';
import * as buffers from './protocol/functions.protocol';
import { TOPIC_EXPERIMENT_STATUS } from '../ipc/protocol/ipc.protocol';

@Injectable()
export class CommandsService {

  private readonly logger: Logger = new Logger(CommandsService.name);

  constructor(private readonly _serial: SerialService,
              private readonly _experiments: ExperimentsService,
              private readonly _ipc: IpcService) {}

  public reboot() {
    this.logger.log('Restartuji HW stimulátor...');
    this._serial.write(buffers.bufferCommandREBOOT());
  }

  public async setupExperiment(id: number) {
    this.logger.log(`Budu nastavovat experiment s ID: ${id}`);
    const experiment: Experiment = await this._experiments.byId(id);
    this.logger.log(`Experiment je typu: ${experiment.type}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'setup', id, outputCount: experiment.outputCount});
    this._serial.write(buffers.bufferCommandEXPERIMENT_SETUP(experiment));
    this._experiments.experimentResult = createEmptyExperimentResult(experiment);
  }

  public initExperiment() {
    this.logger.log('Inicializuji experiment...');
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'init'});
    this._serial.write(buffers.bufferCommandINIT_EXPERIMENT());
  }

  public startExperiment(id: number) {
    this.logger.log(`Spouštím experiment: ${id}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'start', id});
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT(true));
  }

  public stopExperiment(id: number) {
    this.logger.log(`Zastavuji experiment: ${id}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'stop', id});
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT(false));
  }

  public clearExperiment() {
    this.logger.log('Mažu konfiguraci experimentu...');
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'clear'});
    this._serial.write(buffers.bufferCommandCLEAR_EXPERIMENT());
  }

  public togleLed(index: number, enabled: number) {
    this.logger.verbose(`Prepinam ledku na: ${enabled}`);
    const buffer = Buffer.from([0xF0, +index, +enabled, 0x53]);
    this._serial.write(buffer);
  }

}
