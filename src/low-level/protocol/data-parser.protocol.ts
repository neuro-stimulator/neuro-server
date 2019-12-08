import { EventIOChange, EventStimulatorReady, EventStimulatorState, HwEvent } from './hw-events';
import {
  COMMAND_STIMULATOR_STATE,
  COMMAND_INPUT_ACTIVATED,
  COMMAND_OUTPUT_ACTIVATED,
  COMMAND_OUTPUT_DEACTIVATED,
} from './commands.protocol';

export function parseData(data: Buffer): HwEvent {
  let offset = 0;

  const eventType: number = data.readUInt8(offset++);
  offset++;
  switch (eventType) {
    case COMMAND_STIMULATOR_STATE:
      return new EventStimulatorState(data, offset);
    case COMMAND_OUTPUT_ACTIVATED:
      return new EventIOChange('output', 'on', data, offset);
    case COMMAND_OUTPUT_DEACTIVATED:
      return new EventIOChange('output', 'off', data, offset);
    case COMMAND_INPUT_ACTIVATED:
      return new EventIOChange('input', 'on', data, offset);
    default:
      return null;
  }

}

