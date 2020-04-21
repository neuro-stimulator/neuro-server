import { CommandMap, FakeSerialResponder } from './fake-serial-responder';
import { CommandFromStimulator, CommandToStimulator } from '@stechy1/diplomka-share';

export class DefaultFakeSerialResponder extends FakeSerialResponder {

  private readonly _commandMap: CommandMap = {};
  private _stimulatorState: StimulatorState = StimulatorState.READY;

  constructor() {
    super();
    this._initCommands();
  }

  private _initCommands() {
    this._commandMap[CommandToStimulator.COMMAND_STIMULATOR_STATE] = () => this._sendStimulatorState(this._stimulatorState, 1);
    this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT] = (buffer: Buffer, offset: number) => this._manageExperiment(buffer.readUInt8(offset));
    // this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD] = () => this._handleUploadExperimentCommand();
    // this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_SETUP] = () => this._handleSetupExperimentCommand();
    // this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_RUN] = () => this._handleRunExperimentCommand();
    // this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_PAUSE] = () => this._handlePauseExperimentCommand();
    // this._commandMap[CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_FINISH] = () => this._handleFinishExperimentCommand();
  }

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

  private _manageExperiment(requestState: number) {
    this._stimulatorState = requestState;
    this._sendStimulatorState(this._stimulatorState);
  }

  // private _handleUploadExperimentCommand() {
  //   this._stimulatorState = StimulatorState.UPLOADED;
  //   this._sendStimulatorState(this._stimulatorState);
  // }
  //
  // private _handleSetupExperimentCommand() {
  //   this._stimulatorState = StimulatorState.INITIALIZED;
  //   this._sendStimulatorState(this._stimulatorState);
  // }
  //
  // private _handleRunExperimentCommand() {
  //   this._stimulatorState = StimulatorState.RUNNING;
  //   this._sendStimulatorState(this._stimulatorState);
  // }
  //
  // private _handlePauseExperimentCommand() {
  //   this._stimulatorState = StimulatorState.PAUSED;
  //   this._sendStimulatorState(this._stimulatorState);
  // }
  //
  // private _handleFinishExperimentCommand() {
  //   this._stimulatorState = StimulatorState.FINISHED;
  //   this._sendStimulatorState(this._stimulatorState);
  // }


  protected get commandMap(): CommandMap {
    return this._commandMap;
  }
}

enum StimulatorState {
  READY,
  UPLOADED,
  INITIALIZED,
  RUNNING,
  PAUSED,
  FINISHED,
  CLEARED
}
