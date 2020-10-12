import Timeout = NodeJS.Timeout;
import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { CommandFromStimulator, CommandToStimulator } from '@stechy1/diplomka-share';

import { IpcSendMessageCommand, ToggleOutputMessage } from '@diplomka-backend/stim-feature-ipc';

import { CommandMap, FakeSerialResponder } from './fake-serial-responder';

/**
 * Základní implementace FakeSerialResponder odpovídající aktuálnímu
 * programu ve stimulátoru.
 */
@Injectable()
export class DefaultFakeSerialResponder extends FakeSerialResponder {
  private readonly _commandOutput = [CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED, CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED];

  private readonly _commandMap: CommandMap = {};
  private readonly _manageExperimentMap: ManageExperimentMap = {};
  private _stimulatorState = 0;
  private _timeoutID: Timeout;
  private _commandOutputIndex = 0;

  constructor(private readonly commandBus: CommandBus) {
    super();
    this._initCommands();
    this._initManageExperimentCommands();
  }

  private _initCommands() {
    // Zaregistruje nový příkaz pro získání stavu stimulátoru
    this._commandMap[CommandToStimulator.COMMAND_STIMULATOR_STATE] = (commandID: number) => this._sendStimulatorState(commandID, this._stimulatorState, 1);
    // Zaregistruje nový příkaz pro správu experimentu - setup, init, run, pause, finish, clear
    this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT] = (commandID: number, buffer: Buffer, offset: number) =>
      this._manageExperiment(commandID, buffer.readUInt8(offset));
    this._commandMap[CommandToStimulator.COMMAND_BACKDOR_1] = (commandID: number, buffer: Buffer, offset: number) => this._handleBackdoor1(commandID, buffer, offset);
  }

  private _initManageExperimentCommands() {
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_RUN] = () => this._manageExperimentRun();
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_PAUSE] = () => this._manageExperimentStop();
    this._manageExperimentMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_FINISH] = () => this._manageExperimentStop();
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
    const buffer = Buffer.alloc(11);
    let offset = 0;
    buffer.writeUInt8(commandID, offset++);
    buffer.writeUInt8(CommandFromStimulator.COMMAND_STIMULATOR_STATE, offset++);
    buffer.writeUInt8(8, offset++);
    buffer.writeUInt8(state, offset++);
    buffer.writeUInt8(noUpdate, offset++);
    const now = +`${Date.now()}`.substr(4);
    buffer.writeUInt32LE(now, offset);
    offset += 4;
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[0], offset++);
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[1], offset++);

    this.logger.verbose('Odesílám buffer s informacemi o stavu stimulátoru.');
    this.emitData(buffer);
  }

  private _sendIO() {
    this.logger.verbose('Odesílám IO příkaz.');
    this.commandBus.execute(new IpcSendMessageCommand(new ToggleOutputMessage(0))).finally();
    const buffer = Buffer.alloc(10);
    let offset = 0;
    buffer.writeUInt8(0, offset++); // ID zprávy (0 = výchozí)
    buffer.writeUInt8(this._commandOutput[this._commandOutputIndex++ % this._commandOutput.length], offset++);
    buffer.writeUInt8(7, offset++);
    buffer.writeUInt8(0, offset++);
    const now = +`${Date.now()}`.substr(4);
    buffer.writeUInt32LE(now, offset);
    offset += 4;
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[0], offset++);
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[1], offset++);

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
   */
  private _manageExperiment(commandID: number, requestState: number) {
    this._stimulatorState = requestState;
    if (this._manageExperimentMap[requestState]) {
      this._manageExperimentMap[requestState]();
    }
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
    this.commandBus.execute(new IpcSendMessageCommand(new ToggleOutputMessage(index))).finally();
  }
}

interface ManageExperimentMap {
  [key: string]: () => void;
}
