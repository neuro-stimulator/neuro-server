import { Controller, HttpException, HttpStatus, Logger, Options, Param, Patch } from '@nestjs/common';

import { Experiment, ResponseMessageType, createEmptyExperimentResult } from 'diplomka-share';

import * as buffers from './protocol/functions.protocol';
import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';

@Controller('api/commands')
export class CommandsController {

  private readonly logger: Logger = new Logger(CommandsController.name);

  constructor(private readonly _serial: SerialService,
              private readonly _experiments: ExperimentsService) {}

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
    this.logger.log('Restartuji HW stimulátor...');
    this._serial.write(buffers.bufferCommandREBOOT());
  }

  @Patch('time-set/:time')
  public setTime(@Param() params: {time: number}) {
    this.logger.log(`Nastavuji výchozí čas stimulátoru na: ${new Date(params.time).toISOString()}`);
    this._serial.write(buffers.bufferCommandTIME_SET(params.time));
  }

  @Patch('experiment/start/:id')
  public startExperiment(@Param() params: {id: number}) {
    this.logger.log(`Spouštím experiment: ${params.id}`);
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT(true));
  }

  @Patch('experiment/stop/:id')
  public stopExperiment(@Param() params: {id: number}) {
    if (this._experiments.experimentResult !== null
      && (this._experiments.experimentResult.experimentID !== null
        && (+this._experiments.experimentResult.experimentID) !== +params.id)) {
      this.logger.error('Někdo se snaží zastavit neběžící experiment!');
      this.logger.error(`Běžící: ${this._experiments.experimentResult.experimentID}; Neběžící: ${params.id}`);
      throw new HttpException({
        message: {
          text: `Experiment s id: ${params.id} nemůže být zastaven, protože nebyl spuštěn!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    this.logger.log(`Zastavuji experiment: ${params.id}`);
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT(false));
  }

  @Patch('experiment/setup/:id')
  public async setupExperiment(@Param() params: {id: number}) {
    if (this._experiments.experimentResult !== null
      && (this._experiments.experimentResult.experimentID !== null
      && (+this._experiments.experimentResult.experimentID) !== +params.id)) {
      this.logger.error('Někdo se snaží nahrát nový experiment přes starý!');
      this.logger.error(`Aktuální: ${this._experiments.experimentResult.experimentID}; Nahrávaný: ${params.id}`);
      throw new HttpException({
        message: {
          text: `Experiment s id: ${params.id} nemůže být nahrán, protože v paměti je již jiný experiment!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    this.logger.log(`Budu nastavovat experiment s ID: ${params.id}`);
    const experiment: Experiment = await this._experiments.byId(params.id);
    this.logger.log(`Experiment je typu: ${experiment.type}`);
    this._serial.write(buffers.bufferCommandEXPERIMENT_SETUP(experiment));
    this._experiments.experimentResult = createEmptyExperimentResult(experiment);
  }

  @Patch('experiment/init')
  public initExperiment() {
    this.logger.log('Inicializuji experiment...');
    this._serial.write(buffers.bufferCommandINIT_EXPERIMENT());
  }

  @Patch('experiment/clear')
  public clearExperiment() {
    this.logger.log('Mažu konfiguraci experimentu...');
    this._serial.write(buffers.bufferCommandCLEAR_EXPERIMENT());
  }

  // Mimo oficiální protokol
  // V budoucnu se odstraní
  @Patch('toggle-led/:index/:enabled')
  public toggleLed(@Param() params: {index: number, enabled: number}) {
    this.logger.verbose(`Prepinam ledku na: ${params.enabled}`);
    const buffer = Buffer.from([0xF0, +params.index, +params.enabled, 0x53]);
    this._serial.write(buffer);
  }

}
