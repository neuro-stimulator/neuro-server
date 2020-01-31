import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { EventDebug, EventIOChange, EventStimulatorState, HwEvent } from './hw-events';

export function parseData(data: Buffer): HwEvent {
  let offset = 0;

  const eventType: number = data.readUInt8(offset++);
  offset++;
  switch (eventType) {
    case CommandFromStimulator.COMMAND_STIMULATOR_STATE:
      return new EventStimulatorState(data, offset);
    case CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED:
      return new EventIOChange('output', 'on', data, offset);
    case CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED:
      return new EventIOChange('output', 'off', data, offset);
    case CommandFromStimulator.COMMAND_INPUT_ACTIVATED:
      return new EventIOChange('input', 'on', data, offset);
    case 0xF1:
      return new EventDebug(data, offset);
    default:
      return null;
  }

}

