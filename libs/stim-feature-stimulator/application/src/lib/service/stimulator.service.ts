import { Injectable, Logger } from '@nestjs/common';

import { CommandFromStimulator, Experiment, Output, Sequence } from '@stechy1/diplomka-share';
import { functions as buffers } from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialService } from './serial.service';
// import { StimulatorStateData } from '@ diplomka-backend/stim-feature-stimulator';

@Injectable()
export class StimulatorService {
  public static readonly NO_EXPERIMENT_ID = -1;

  private readonly logger: Logger = new Logger(StimulatorService.name);

  public currentExperimentID = StimulatorService.NO_EXPERIMENT_ID;
  public lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY;

  constructor(private readonly service: SerialService) {}

  /**
   * Provede aktualizaci firmware stimulátoru
   *
   * @param path Cesta k firmware stimulátoru
   */
  public updateFirmware(path: string): Promise<void> {
    return new Promise((resolve) => {
      // firmware.path = "/tmp/firmware/some_random_name"
      // exec(`sudo cp ${path} /mnt/stm/firmware.bin`, (err, stdout, stderr) => {
      //   if (err) {
      //     // some err occurred
      //     this.logger.error(err);
      //     throw new FirmwareUpdateFailedException();
      //   } else {
      //     // the *entire* stdout and stderr (buffered)
      //     this.logger.debug(`stdout: ${stdout}`);
      //     this.logger.error(`stderr: ${stderr}`);
      //     resolve();
      //   }
      // });
      setTimeout(() => resolve(), 1000);
    });
  }

  /**
   * Odešle příkaz na stimulátoru, který si vyžádá aktuální stav stimulátoru.
   *
   * @param commandID ID příkazu
   */
  public stimulatorState(commandID = 0): void {
    this.logger.verbose('Budu odesílat příkaz pro získání stavu stimulátoru.');
    this.service.write(buffers.bufferCommandSTIMULATOR_STATE(commandID));
  }

  /**
   * Odešle příkaz na stimulátor, který obsahuje serializovaný experiment
   *
   * @param commandID ID příkazu
   * @param experiment Experiment, který se má nahrát
   * @param sequence Případná sekvence
   */
  public uploadExperiment(commandID = 0, experiment: Experiment<Output>, sequence?: Sequence): void {
    this.logger.verbose(`Nahrávám experiment s ID: ${experiment.id}.`);
    // Uložím si ID právě nahraného experimentu
    this.currentExperimentID = <number>experiment.id;
    this.service.write(buffers.bufferCommandEXPERIMENT_UPLOAD(commandID, experiment, sequence));
  }

  /**
   * Odešle příkaz na stimulátor, který inicializuje experiment
   *
   * @param commandID ID příkazu
   * @param id Id experimentu, který se má inicializovat
   */
  public setupExperiment(commandID = 0, id: number): void {
    this.logger.verbose(`Budu nastavovat experiment s ID: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(buffers.bufferCommandMANAGE_EXPERIMENT(commandID, 'setup'));
  }

  /**
   * Spustí experiment
   *
   * @param commandID ID příkazu
   * @param id Id experimentu, který se má spustit
   */
  public runExperiment(commandID = 0, id: number): void {
    this.logger.verbose(`Spouštím experiment: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(buffers.bufferCommandMANAGE_EXPERIMENT(commandID, 'run'));
  }

  /**
   * Pozastaví aktuálně spuštěný experiment
   *
   * @param commandID ID příkazu
   * @param id Id experimentu, který se má pozastavit
   */
  public pauseExperiment(commandID = 0, id: number): void {
    this.logger.verbose(`Pozastavuji experiment: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(buffers.bufferCommandMANAGE_EXPERIMENT(commandID, 'pause'));
  }

  /**
   * Ukončí aktuálně spuštěný experiment
   *
   * @param commandID ID příkazu
   * @param id Id experimentu, který se má ukončit
   */
  public finishExperiment(commandID = 0, id: number): void {
    this.logger.verbose(`Zastavuji experiment: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(buffers.bufferCommandMANAGE_EXPERIMENT(commandID, 'finish'));
    // Zneplatním informaci o aktuálně nahraném experimentu
    this.currentExperimentID = StimulatorService.NO_EXPERIMENT_ID;
  }

  /**
   * Vymaže konfiguraci experimentu z paměti stimulátoru
   *
   * @param commandID ID příkazu
   */
  public clearExperiment(commandID = 0): void {
    this.logger.verbose('Mažu konfiguraci experimentu...');
    // Odešlu přes IPC informaci, že budu mazat konfiguraci experimentu
    // this._ipc.send(TOPIC_EXPERIMENT_STATUS, { status: 'clear' });
    // Provedu serilizaci a odeslání příkazu
    this.service.write(buffers.bufferCommandMANAGE_EXPERIMENT(commandID, 'clear'));
    // Zneplatním informaci o aktuálně nahraném experimentu
    this.currentExperimentID = -1;
  }

  /**
   * Odešle část ERP sekvence na stimulátor
   *
   * @param commandID ID příkazu
   * @param offset Offset v sekvenci, od kterého se mají odeslat data
   * @param index Index ve stimulátoru, na který se budou data ukládat (přijde s požadavkem)
   */
  public async sendNextSequencePart(commandID = 0, offset: number, index: number): Promise<void> {
    // const experimentId = this._experimentResults.activeExperimentResult
    //   .experimentID;
    // const experiment: ExperimentERP = (await this._experiments.byId(
    //   experimentId
    // )) as ExperimentERP;
    // this.logger.verbose(
    //   `Budu nahrávat část sekvence s ID: ${experiment.sequenceId}. offset=${offset}, index=${index}`
    // );
    // const sequence: Sequence = await this._sequences.byId(
    //   experiment.sequenceId
    // );
    // this._serial.write(
    //   buffers.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index)
    // );
  }

  /**
   * Odešle příkaz k přepnutí stavu LED
   *
   * @param commandID ID příkazu
   * @param index Index, na kterém se LED nachází
   * @param brightness Intenzita LED
   */
  public toggleLed(commandID: number, index: number, brightness: number): void {
    this.logger.verbose(`Nastavuji svítivost LED s indexem: ${index} na: ${brightness}`);
    const buffer: Buffer = buffers.bufferCommandBACKDOOR_1(commandID, index, brightness);
    this.service.write(buffer);
  }
}
