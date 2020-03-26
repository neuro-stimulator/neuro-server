import { Injectable, Logger } from '@nestjs/common';

import { createEmptyExperimentResult, Experiment, ExperimentERP, ExperimentType, MessageCodes, Sequence } from '@stechy1/diplomka-share';

import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';
import { IpcService } from '../ipc/ipc.service';
import * as buffers from './protocol/functions.protocol';
import { TOPIC_EXPERIMENT_STATUS } from '../ipc/protocol/ipc.protocol';
import { SequencesService } from '../sequences/sequences.service';
import { EventNextSequencePart, EventStimulatorState } from '../low-level/protocol/hw-events';
import { MessagePublisher } from '../share/utils';

@Injectable()
export class CommandsService implements MessagePublisher {

  private readonly logger: Logger = new Logger(CommandsService.name);

  private _publishMessage: (topic: string, data: any) => void;

  constructor(private readonly _serial: SerialService,
              private readonly _experiments: ExperimentsService,
              private readonly _sequences: SequencesService,
              private readonly _ipc: IpcService) {
    this._serial.bindEvent(EventNextSequencePart.name, (event) => this._sendNextSequencePart(event));
  }

  private async _sendNextSequencePart(event: EventNextSequencePart) {
    await this.sendNextSequencePart(event.offset, event.index);
  }

  public async stimulatorState(waitForResult: boolean = true) {
    this.logger.log('Odesílám příkaz na získání aktuálního stavu stimulátoru.');
    if (!waitForResult) {
      this._serial.write(buffers.bufferCommandSTIMULATOR_STATE());
      return;
    }

    const self = this;
    return new Promise((resolve, reject) => {
      let timeoutId;
      function serialEventCallback(event: EventStimulatorState) {
        self._serial.unbindEvent(EventStimulatorState.name, serialEventCallback);
        clearTimeout(timeoutId);
        resolve(event);
      }

      timeoutId = setTimeout(serialEventCallback, 4000);
      this._serial.bindEvent(EventStimulatorState.name, serialEventCallback);
      this._serial.write(buffers.bufferCommandSTIMULATOR_STATE());
    });
  }

  public async uploadExperiment(id: number) {
    this.logger.log(`Budu nahrávat experiment s ID: ${id}.`);
    const experiment: Experiment = await this._experiments.byId(id);
    let sequence: Sequence;
    if (experiment.type === ExperimentType.ERP) {
      sequence = await this._sequences.byId((experiment as ExperimentERP).sequenceId);
      if (!sequence) {
        this.logger.error('Sekvence nebyla nalezena! Je možné, že experiment se nebude moct nahrát.');
      }
    }
    this.logger.log(`Experiment je typu: ${experiment.type}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'upload', id, outputCount: experiment.outputCount});
    this._serial.write(buffers.bufferCommandEXPERIMENT_UPLOAD(experiment, sequence));
    this.logger.log('Vytvářím novou instanci výsledku experimentu.');
    this._experiments.experimentResult = createEmptyExperimentResult(experiment);
  }

  public async setupExperiment(id: number) {
    this.logger.log(`Budu nastavovat experiment s ID: ${id}`);
    const experiment: Experiment = await this._experiments.byId(id);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'setup', id, outputCount: experiment.outputCount});
    this._serial.write(buffers.bufferCommandEXPERIMENT_SETUP());
  }

  public runExperiment(id: number) {
    if (!id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_RUN_NOT_INITIALIZED}`);
    }
    this.logger.log(`Spouštím experiment: ${id}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'run', id});
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('run'));
  }

  public pauseExperiment(id: number) {
    if (!id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_PAUSE_NOT_STARTED}`);
    }
    this.logger.log(`Pozastavuji experiment: ${id}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'pause', id});
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('pause'));
  }

  public finishExperiment(id: number) {
    if (!id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_FINISH_NOT_RUNNING}`);
    }
    this.logger.log(`Zastavuji experiment: ${id}`);
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'finish', id});
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('finish'));
  }

  public clearExperiment() {
    this.logger.log('Mažu konfiguraci experimentu...');
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'clear'});
    this._serial.write(buffers.bufferCommandCLEAR_EXPERIMENT());
  }

  public async sendNextSequencePart(offset: number, index: number) {
    const experimentId = this._experiments.experimentResult.experimentID;
    const experiment: ExperimentERP = await this._experiments.byId(experimentId) as ExperimentERP;
    this.logger.log(`Budu nahrávat část sekvence s ID: ${experiment.sequenceId}. offset=${offset}, index=${index}`);
    const sequence: Sequence = await this._sequences.byId(experiment.sequenceId);
    this._serial.write(buffers.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index));
  }

  public togleLed(index: number, enabled: number) {
    this.logger.verbose(`Prepinam ledku na: ${enabled}`);
    const buffer = Buffer.from([0xF0, +index, +enabled, 0x53]);
    this._serial.write(buffer);
  }

  public memoryRequest(memoryType: number) {
    this.logger.log(`Budu získávat pamět '${memoryType}' ze stimulátoru...`);
    const buffer = buffers.bufferMemory(memoryType);
    this._serial.write(buffer);
  }

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }
}
