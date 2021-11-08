import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';
import {
  StimulatorData,
  StimulatorStateData,
  StimulatorIoChangeData,
  StimulatorNextSequencePartData,
  StimulatorMemoryData,
  StimulatorRequestFinishData,
  UnsupportedStimulatorCommandException,
} from '@neuro-server/stim-feature-stimulator/domain';

import { ParseStimulatorDataQuery } from '../impl/parse-stimulator-data.query';

@QueryHandler(ParseStimulatorDataQuery)
export class ParseStimulatorDataHandler implements IQueryHandler<ParseStimulatorDataQuery, [number, StimulatorData]> {
  private readonly logger: Logger = new Logger(ParseStimulatorDataHandler.name);

  async execute(query: ParseStimulatorDataQuery): Promise<[number, StimulatorData]> {
    this.logger.debug('Parsuji příchozí data ze stimulátoru...');
    const data = query.buffer;
    let offset = 0;
    let stimulatorData: StimulatorData;

    const commandID: number = data.readUInt8(offset++);
    const eventType: number = data.readUInt8(offset++);
    // Délka příkazu mě nezajímá, proto ji přeskočím
    offset++;
    switch (eventType) {
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE:
        stimulatorData = new StimulatorStateData(data, offset);
        break;
      case CommandFromStimulator.COMMAND_STIMULATOR_REQUEST_FINISH:
        stimulatorData = new StimulatorRequestFinishData(data, offset);
        break;
      case CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED:
        stimulatorData = new StimulatorIoChangeData('output', 'on', data, offset);
        break;
      case CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED:
        stimulatorData = new StimulatorIoChangeData('output', 'off', data, offset);
        break;
      case CommandFromStimulator.COMMAND_INPUT_ACTIVATED:
        stimulatorData = new StimulatorIoChangeData('input', 'on', data, offset);
        break;
      case CommandFromStimulator.COMMAND_REQUEST_SEQUENCE_NEXT_PART:
        stimulatorData = new StimulatorNextSequencePartData(data, offset);
        break;
      case CommandFromStimulator.COMMAND_MEMORY:
        stimulatorData = new StimulatorMemoryData(data, offset);
        break;
      default:
        throw new UnsupportedStimulatorCommandException(data);
    }

    return [commandID, stimulatorData];
  }
}
