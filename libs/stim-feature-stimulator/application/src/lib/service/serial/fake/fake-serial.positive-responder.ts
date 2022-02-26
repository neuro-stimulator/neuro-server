import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator, CommandToStimulator, ConnectionStatus } from '@stechy1/diplomka-share';

import { IpcConnectionStatusQuery, IpcToggleOutputCommand } from '@neuro-server/stim-feature-ipc/application';
import { ExperimentProtocolCodec, FakeProtocol, SequenceProtocolCodec, StimulatorActionType } from '@neuro-server/stim-feature-stimulator/domain';

import { CommandMap, FakeSerialResponder } from './fake-serial-responder';
import { FakeStimulatorDevice } from './fake-stimulator.device';

import Timeout = NodeJS.Timeout;

/**
 * Základní implementace FakeSerialResponder odpovídající aktuálnímu
 * programu ve stimulátoru.
 */
@Injectable()
export class DefaultFakeSerialResponder extends FakeSerialResponder {
  private readonly _commandOutputState = [CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED, CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED];

  private readonly _commandMap: CommandMap = {};
  private readonly _manageExperimentMap: ManageExperimentMap = {};
  private _stimulatorState = 0;
  private _timeoutID: Timeout;
  private _commandOutputIndex = 0;

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus,
              private readonly experimentProtocol: ExperimentProtocolCodec,
              private readonly sequenceProtocol: SequenceProtocolCodec,
              private readonly fakeProtocol: FakeProtocol,
              private readonly fakeStimulatorDevice: FakeStimulatorDevice) {
    super();
    this._initCommands();
    this._initManageExperimentCommands();
  }

  private _initCommands() {
    // Zaregistruje nový příkaz pro získání stavu stimulátoru
    this._commandMap[CommandToStimulator.COMMAND_STIMULATOR_STATE] = (commandID: number) => this._sendStimulatorState(commandID, this._stimulatorState, 1);
    // Zaregistruje nový příkaz pro správu experimentu - setup, init, run, pause, finish, clear
    this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT] = (commandID: number, buffer: Buffer, offset: number) =>
      this._manageExperiment(commandID, buffer.readUInt8(offset), buffer);
    this._commandMap[CommandToStimulator.COMMAND_BACKDOR_1] = (commandID: number, buffer: Buffer, offset: number) => this._handleBackdoor1(commandID, buffer, offset);
  }

  private _initManageExperimentCommands() {
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD] = (buffer: Buffer) => this._manageExperimentUpload(buffer);
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_RUN] = () => this._manageExperimentRun();
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_PAUSE] = () => this._manageExperimentStop();
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_FINISH] = () => this._manageExperimentStop();
  }

  private _manageExperimentUpload(buffer: Buffer) {
    this.fakeStimulatorDevice.experiment = this.experimentProtocol.decodeExperiment(buffer);
  }

  private _manageExperimentRun() {
    if (this._timeoutID) {
      this.logger.warn('Nemůžu spustit experiment, protože jeden už běží.');
      return;
    }

    this.logger.verbose('Spouštím virtuální experiment.');
    this._timeoutID = (setInterval(() => this._sendIO(), 750) as unknown) as Timeout;
  }
  private _manageExperimentStop() {
    if (!this._timeoutID) {
      this.logger.warn('Nemůžu zastavit experiment, protože žádný neběží.');
      return;
    }

    this.logger.verbose('Zastavuji experiment.');
    clearInterval(this._timeoutID);
    this._timeoutID = null;
  }

  /**
   * Odešle aktuální stav fake stimulátoru.
   *
   * @param commandID ID zprávy
   * @param state Stav stimulátoru
   * @param noUpdate Zda-li se má aktualizovat GUI
   */
  private _sendStimulatorState(commandID: number, state: number, noUpdate = 0) {
    this.logger.verbose('Sestavuji buffer s informacemi o stavu stimulátoru.');

    const buffer = this.fakeProtocol.bufferCommandSTIMULATOR_STATE(commandID, state, noUpdate);

    this.logger.verbose('Odesílám buffer s informacemi o stavu stimulátoru.');

    this.emitData(buffer);
  }

  protected lastOutputIndex = 0;

  private _getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }


  /**
   * Odešle příkaz reprezenující změnu stavu výstupu stimulátoru
   */
  private _sendIO() {
    this.logger.verbose('Odesílám IO příkaz.');
    this.commandBus.execute(new IpcToggleOutputCommand(0)).finally();

    const lastState = this._commandOutputState[this._commandOutputIndex % this._commandOutputState.length];
    if (lastState === CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED) {
      this.lastOutputIndex = this._getRandomInt(0, this.fakeStimulatorDevice.outputCount);

    }
    const buffer = this.fakeProtocol.bufferCommandSEND_IO(this._commandOutputState[this._commandOutputIndex++ % this._commandOutputState.length], this.lastOutputIndex);

    this.emitData(buffer);
  }

  /**
   * Ve stimulátoru se na základě této funkce provádí obsluha experimentu.
   * requestState:
   *              - 1: upload  -> experiment se má uložit do paměti stimulátoru
   *              - 2: init    -> experiment se má inicializovat, p
   *                              řípadně si pak vyžádat další data
   *              - 3: run     -> spustí(obnoví) experiment
   *              - 4: pause   -> pozastaví experiment
   *              - 5: finish  -> ukončí experiment
   *              - 6: clear   -> vyčistí paměť ve stimulátoru od experimentu
   *
   * V této implementaci se pouze odešle požadovaný stav zpátky na server.
   *
   * @param commandID ID zprávy
   * @param requestState Stav, do kterého má stimulátor přejít
   * @param buffer Buffer s daty odeslanými do stimulátoru
   */
  private _manageExperiment(commandID: number, requestState: number, buffer: Buffer) {
    this.logger.verbose(`Budu upravovat stav experimentu na: ${requestState}.`);
    if (this._manageExperimentMap[requestState]) {
      this._manageExperimentMap[requestState](buffer);
    }
    this._stimulatorState = requestState;
    this._sendStimulatorState(commandID, this._stimulatorState);
  }

  protected get commandMap(): CommandMap {
    return this._commandMap;
  }

  /**
   * Fake funkce pro Backdoor1 - zaloguje, že se snažím nastavit určitý výstup
   * a zároveň se odešle zpráva na IPC pro přepnutí výstupu
   *
   * @param commandID ID zprávy
   * @param buffer Buffer se zprávou
   * @param offset začátek offsetu pro buffer
   */
  private _handleBackdoor1(commandID: number, buffer: Buffer, offset: number) {
    const index = buffer.readUInt8(offset++);
    const brightness = buffer.readUInt8(offset);
    this.logger.log(`Přišel příkaz pro nastavení výstupu na stimulátoru: {index=${index}, brightness=${brightness}}.`);
    this.queryBus.execute(new IpcConnectionStatusQuery()).then(status => {
      if (status === ConnectionStatus.CONNECTED) {
        this.commandBus.execute(new IpcToggleOutputCommand(index)).finally();
      } else {
        this.logger.log('IPC není připojeno, neodesílám žádný příkaz pro nastavení výstupu.');
      }
    });
  }
}

type ManageExperimentMap = Partial<Record<StimulatorActionType, (buffer: Buffer) => void>>;
