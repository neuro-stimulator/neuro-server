import { CommandMap, FakeSerialResponder } from './fake-serial-responder';
import { CommandFromStimulator, CommandToStimulator } from '@stechy1/diplomka-share';

/**
 * Základní implementace FakeSerialResponder odpovídající aktuálnímu
 * programu ve stimulátoru.
 */
export class DefaultFakeSerialResponder extends FakeSerialResponder {

  private readonly _commandMap: CommandMap = {};
  private _stimulatorState = 0;

  constructor() {
    super();
    this._initCommands();
  }

  private _initCommands() {
    // Zaregistruje nový příkaz pro získání stavu stimulátoru
    this._commandMap[CommandToStimulator.COMMAND_STIMULATOR_STATE] = () => this._sendStimulatorState(this._stimulatorState, 1);
    // Zaregistruje nový příkaz pro správu experimentu - setup, init, run, pause, finish, clear
    this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT] = (buffer: Buffer, offset: number) => this._manageExperiment(buffer.readUInt8(offset));
  }

  /**
   * Odešle aktuální stav fake stimulátoru.
   *
   * @param state Stav stimulátoru
   * @param noUpdate Zda-li se má aktualizovat GUI
   */
  private _sendStimulatorState(state: number, noUpdate: number = 0) {
    const buffer = Buffer.alloc(10);
    let offset = 0;
    buffer.writeUInt8(CommandFromStimulator.COMMAND_STIMULATOR_STATE, offset++);
    buffer.writeUInt8(8, offset++);
    buffer.writeUInt8(state, offset++);
    buffer.writeUInt8(noUpdate, offset++);
    const now = Date.now() / 1000;
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
   * @param requestState Stav, do kterého má stimulátor přejít
   */
  private _manageExperiment(requestState: number) {
    this._stimulatorState = requestState;
    this._sendStimulatorState(this._stimulatorState);
  }

  protected get commandMap(): CommandMap {
    return this._commandMap;
  }
}

