import { Injectable, Logger } from '@nestjs/common';

import { CommandFromStimulator, Experiment, Output, Sequence } from '@stechy1/diplomka-share';
import { StimulatorProtocol } from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialService } from './serial.service';

@Injectable()
export class StimulatorService {
  public static readonly NO_EXPERIMENT_ID = -1;

  private readonly logger: Logger = new Logger(StimulatorService.name);

  public currentExperimentID = StimulatorService.NO_EXPERIMENT_ID;
  public lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY;

  constructor(private readonly service: SerialService,
              private readonly stimulatorProtocol: StimulatorProtocol) {}

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
    this.service.write(this.stimulatorProtocol.bufferCommandSTIMULATOR_STATE(commandID));
  }

  /**
   * Odešle příkaz na stimulátor, který obsahuje serializovaný experiment
   *
   * @param commandID ID příkazu
   * @param experiment Experiment, který se má nahrát
   * @param sequenceSize Délka sekvence (pokud ji experiment podporuje)
   */
  public uploadExperiment(experiment: Experiment<Output>, commandID = 0, sequenceSize?: number): void {
    this.logger.verbose(`Nahrávám experiment s ID: ${experiment.id}.`);
    // Uložím si ID právě nahraného experimentu
    this.currentExperimentID = experiment.id;
    this.service.write(this.stimulatorProtocol.bufferCommandEXPERIMENT_UPLOAD(experiment, commandID, sequenceSize));
  }

  /**
   * Odešle příkaz na stimulátor, který inicializuje experiment
   *
   * @param id Id experimentu, který se má inicializovat
   * @param commandID ID příkazu
   */
  public setupExperiment(id: number, commandID = 0): void {
    this.logger.verbose(`Budu nastavovat experiment s ID: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(this.stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT('setup', commandID));
  }

  /**
   * Spustí experiment
   *
   * @param id Id experimentu, který se má spustit
   * @param commandID ID příkazu
   */
  public runExperiment(id: number, commandID = 0): void {
    this.logger.verbose(`Spouštím experiment: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(this.stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT('run', commandID));
  }

  /**
   * Pozastaví aktuálně spuštěný experiment
   *
   * @param id Id experimentu, který se má pozastavit
   * @param commandID ID příkazu
   */
  public pauseExperiment(id: number, commandID = 0): void {
    this.logger.verbose(`Pozastavuji experiment: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(this.stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT('pause', commandID));
  }

  /**
   * Ukončí aktuálně spuštěný experiment
   *
   * @param id Id experimentu, který se má ukončit
   * @param commandID ID příkazu
   */
  public finishExperiment(id: number, commandID = 0): void {
    this.logger.verbose(`Zastavuji experiment: ${id}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.write(this.stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT('finish', commandID));
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
    this.service.write(this.stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT('clear', commandID));
    // Zneplatním informaci o aktuálně nahraném experimentu
    this.currentExperimentID = StimulatorService.NO_EXPERIMENT_ID;
  }

  /**
   * Odešle část ERP sekvence na stimulátor
   *
   * @param sequence Sekvence, ze které se nahraje část do stimulátoru
   * @param offset Offset v sekvenci, od kterého se mají odeslat data
   * @param index Index ve stimulátoru, na který se budou data ukládat (přijde s požadavkem)
   * @param commandID ID příkazu
   */
  public sendNextSequencePart(sequence: Sequence, offset: number, index: number, commandID = 0): void {
    this.logger.verbose('Nahrávám část sekvence...');
    this.service.write(this.stimulatorProtocol.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index, commandID));
  }

  /**
   * Odešle příkaz k přepnutí stavu LED
   *
   * @param index Index, na kterém se LED nachází
   * @param brightness Intenzita LED
   * @param commandID ID příkazu
   */
  public toggleLed(index: number, brightness: number, commandID = 0): void {
    this.logger.verbose(`Nastavuji svítivost LED s indexem: ${index} na: ${brightness}`);
    const buffer: Buffer = this.stimulatorProtocol.bufferCommandBACKDOOR_1(index, brightness, commandID);
    this.service.write(buffer);
  }
}
