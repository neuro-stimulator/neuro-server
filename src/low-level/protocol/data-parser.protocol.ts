import { CommandFromStimulator } from 'diplomka-share';

import { EventIOChange, EventStimulatorState, HwEvent } from './hw-events';

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
    default:
      return null;
  }

}

