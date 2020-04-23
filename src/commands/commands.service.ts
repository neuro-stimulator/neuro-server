import Timeout = NodeJS.Timeout;

import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentERP, ExperimentType, MessageCodes, Sequence } from '@stechy1/diplomka-share';

import { MessagePublisher } from '../share/utils';
import { SerialService } from '../low-level/serial.service';
import { EventNextSequencePart, EventStimulatorState } from '../low-level/protocol/hw-events';
import { IpcService } from '../ipc/ipc.service';
import { TOPIC_EXPERIMENT_STATUS } from '../ipc/protocol/ipc.protocol';
import { ExperimentsService } from '../experiments/experiments.service';
import { ExperimentResultsService } from '../experiment-results/experiment-results.service';
import { SequencesService } from '../sequences/sequences.service';
import * as buffers from './protocol/functions.protocol';

/**
 * Služba odpovědná za odeslání příkazů do stimulátoru
 */
@Injectable()
export class CommandsService implements MessagePublisher {

  private readonly logger: Logger = new Logger(CommandsService.name);

  private _publishMessage: (topic: string, data: any) => void;

  constructor(private readonly _serial: SerialService,
              private readonly _experiments: ExperimentsService,
              private readonly _experimentResults: ExperimentResultsService,
              private readonly _sequences: SequencesService,
              private readonly _ipc: IpcService) {
    this._serial.bindEvent(EventNextSequencePart.name, (event) => this._sendNextSequencePart(event));
  }

  private async _sendNextSequencePart(event: EventNextSequencePart) {
    await this.sendNextSequencePart(event.offset, event.index);
  }

  /**
   * Odešle na stimulátor příkaz k získání aktuálního stavu stimulátoru.
   *
   * @param waitForResult True, pokud se má čekat na výsledek.
   * @return Promise<EventStimulatorState|undefined> Vrátí nic, nebo výsledek se stavem stimulátoru.
   */
  public async stimulatorState(waitForResult: boolean = true): Promise<EventStimulatorState|undefined> {
    this.logger.log('Odesílám příkaz na získání aktuálního stavu stimulátoru.');
    // Pokud nemám čekat na výsledek
    if (!waitForResult) {
      // Odešlu příkaz rovnou a končím
      this._serial.write(buffers.bufferCommandSTIMULATOR_STATE());
      return;
    }

    // V opačném případě si uložím vlastní instanci a budu vracet promisu
    const self = this;
    return new Promise((resolve, reject) => {
      // Založím si pomocnou proměnou pro timeoutId
      let timeoutId: Timeout;

      /**
       * Funkce s callbackem se zavolá když přijdou data ze stimulátoru,
       * nebo když vyprší timeout.
       *
       * @param event Event s daty.
       */
      function serialEventCallback(event: EventStimulatorState) {
        // Odhlásím odběr události ze seriové linky
        self._serial.unbindEvent(EventStimulatorState.name, serialEventCallback);
        // Vyčistím timeout aby se funkce nezavolala podruhé (v případě, že data přišla ze stimulátoru)
        clearTimeout(timeoutId);
        // Pomocí resolve vrátím data
        resolve(event);
      }

      // Vytvořím timeout, aby callback nezůstal viset
      timeoutId = setTimeout(serialEventCallback, 4000);
      // Zaregistruji odběr události na seriovou linku
      this._serial.bindEvent(EventStimulatorState.name, serialEventCallback);
      // Odešlu příkaz na stimulátor
      this._serial.write(buffers.bufferCommandSTIMULATOR_STATE());
    });
  }

  /**
   * Odešle příkaz na stimulátor, který obsahuje serializovaný experiment
   *
   * @param id Id experimentu, který se má nahrát
   */
  public async uploadExperiment(id: number) {
    this.logger.log(`Budu nahrávat experiment s ID: ${id}.`);
    // Získám experiment z databáze
    const experiment: Experiment = await this._experiments.byId(id);
    let sequence: Sequence;
    // Pokud se jedná o typ ERP, vytáhnu si ještě sekvenci
    if (experiment.type === ExperimentType.ERP) {
      sequence = await this._sequences.byId((experiment as ExperimentERP).sequenceId);
      // Pokud není sekvence nalezena, tak to zaloguji
      // TODO upozornit uživatele, že není co přehrávat
      if (!sequence) {
        this.logger.error('Sekvence nebyla nalezena! Je možné, že experiment se nebude moct nahrát.');
      }
    }
    this.logger.log(`Experiment je typu: ${experiment.type}`);
    // Odešlu přes IPC informaci, že nahrávám experiment na stimulátor
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'upload', id, outputCount: experiment.outputCount});
    // Provedu serilizaci a odeslání příkazu
    this._serial.write(buffers.bufferCommandEXPERIMENT_UPLOAD(experiment, sequence));
    this.logger.log('Vytvářím novou instanci výsledku experimentu.');
    // Ve výsledcích experimentu si založím novou instanci výsledku experimentu
    this._experimentResults.createEmptyExperimentResult(experiment);
  }

  /**
   * Odešle příkaz na stimulátor, který inicializuje experiment
   *
   * @param id Id experimentu, který se má inicializovat
   */
  public async setupExperiment(id: number) {
    if (this._experimentResults.activeExperimentResult.experimentID !== id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_SETUP_NOT_UPLOADED}`);
    }
    this.logger.log(`Budu nastavovat experiment s ID: ${id}`);
    // Odešlu přes IPC informaci, že budu inicializovat experiment
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'setup', id});
    // Provedu serilizaci a odeslání příkazu
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('setup'));
  }

  /**
   * Spustí experiment
   *
   * @param id Id experimentu, který se má spustit
   */
  public runExperiment(id: number) {
    if (this._experimentResults.activeExperimentResult.experimentID !== id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_RUN_NOT_INITIALIZED}`);
    }
    this.logger.log(`Spouštím experiment: ${id}`);
    // Odešlu přes IPC informaci, že budu spouštět experiment
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'run', id});
    // Provedu serilizaci a odeslání příkazu
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('run'));
  }

  /**
   * Pozastaví aktuálně spuštěný experiment
   *
   * @param id Id experimentu, který se má pozastavit
   */
  public pauseExperiment(id: number) {
    if (this._experimentResults.activeExperimentResult.experimentID !== id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_PAUSE_NOT_STARTED}`);
    }
    this.logger.log(`Pozastavuji experiment: ${id}`);
    // Odešlu přes IPC informaci, že budu pozastavovat experiment
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'pause', id});
    // Provedu serilizaci a odeslání příkazu
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('pause'));
  }

  /**
   * Ukončí aktuálně spuštěný experiment
   *
   * @param id Id experimentu, který se má ukončit
   */
  public finishExperiment(id: number) {
    if (this._experimentResults.activeExperimentResult.experimentID !== id) {
      throw new Error(`${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_FINISH_NOT_RUNNING}`);
    }
    this.logger.log(`Zastavuji experiment: ${id}`);
    // Odešlu přes IPC informaci, že budu ukončovat experiment
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'finish', id});
    // Provedu serilizaci a odeslání příkazu
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('finish'));
  }

  /**
   * Vymaže konfiguraci experimentu z paměti stimulátoru
   */
  public clearExperiment() {
    this.logger.log('Mažu konfiguraci experimentu...');
    // Odešlu přes IPC informaci, že budu mazat konfiguraci experimentu
    this._ipc.send(TOPIC_EXPERIMENT_STATUS, {status: 'clear'});
    // Provedu serilizaci a odeslání příkazu
    this._serial.write(buffers.bufferCommandMANAGE_EXPERIMENT('clear'));
  }

  /**
   * Odešle část ERP sekvence na stimulátor
   *
   * @param offset Offset v sekvenci, od kterého se mají odeslat data
   * @param index Index ve stimulátoru, na který se budou data ukládat (přijde s požadavkem)
   */
  public async sendNextSequencePart(offset: number, index: number) {
    const experimentId = this._experimentResults.activeExperimentResult.experimentID;
    const experiment: ExperimentERP = await this._experiments.byId(experimentId) as ExperimentERP;
    this.logger.log(`Budu nahrávat část sekvence s ID: ${experiment.sequenceId}. offset=${offset}, index=${index}`);
    const sequence: Sequence = await this._sequences.byId(experiment.sequenceId);
    this._serial.write(buffers.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index));
  }

  /**
   * Odešle příkaz k přepnutí stavu LED
   *
   * @param index Index, na kterém se LED nachází
   * @param enabled 1 = enabled; 0 = disabled
   */
  public togleLed(index: number, enabled: number) {
    this.logger.verbose(`Prepinam ledku na: ${enabled}`);
    const buffer = Buffer.from([0xF0, +index, +enabled, 0x53]);
    this._serial.write(buffer);
  }

  /**
   * Odešle příkaz k získání obsahu paměti ze stimulátoru
   *
   * @param memoryType Typ paměti, který se má vypsat
   */
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
