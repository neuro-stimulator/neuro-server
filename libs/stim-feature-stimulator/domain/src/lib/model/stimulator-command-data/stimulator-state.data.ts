import { StimulatorStateEvent, CommandFromStimulator } from '@stechy1/diplomka-share';

const STATE_MAP = {
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY]: 'COMMAND_STIMULATOR_STATE_READY',
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_UPLOADED]: 'COMMAND_STIMULATOR_STATE_UPLOADED',
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED]: 'COMMAND_STIMULATOR_STATE_INITIALIZED',
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING]: 'COMMAND_STIMULATOR_STATE_RUNNING',
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_PAUSED]: 'COMMAND_STIMULATOR_STATE_PAUSED',
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED]: 'COMMAND_STIMULATOR_STATE_FINISHED',
  [CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED]: 'COMMAND_STIMULATOR_STATE_CLEARED',
};

export class StimulatorStateData implements StimulatorStateEvent {


  public readonly name = StimulatorStateData.name;

  public readonly state: number;
  public readonly noUpdate: boolean;
  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.state = buffer.readUInt8(offset++);
    this.noUpdate = Boolean(buffer.readUInt8(offset++));
    this.timestamp = buffer.readUInt32LE(offset++);
  }

  public toString(): string {
    return `state: ${this.state} = ${STATE_MAP[this.state]}; noUpdate: ${this.noUpdate}; timestamp: ${this.timestamp};`;
  }
}
