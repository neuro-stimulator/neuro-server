import { Logger } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';

import { ParseStimulatorDataQuery } from '../impl/parse-stimulator-data.query';
import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { UnsupportedStimulatorCommandException } from '../../../domain/exception';
import {
  StimulatorStateData,
  StimulatorIoChangeData,
  StimulatorNextSequencePartData,
  StimulatorMemoryData,
  StimulatorData,
} from '../../../domain/model/stimulator-command-data';

export class ParseStimulatorDataHandler
  implements IQueryHandler<ParseStimulatorDataQuery, StimulatorData> {
  private readonly logger: Logger = new Logger(ParseStimulatorDataHandler.name);
  constructor() {}

  async execute(query: ParseStimulatorDataQuery): Promise<any> {
    this.logger.log('Parsuji příchozí data ze stimulátoru...');
    const data = query.buffer;
    let offset = 0;

    const eventType: number = data.readUInt8(offset++);
    // Délka příkazu mě nezajímá, proto ji přeskočím
    offset++;
    switch (eventType) {
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE:
        return new StimulatorStateData(data, offset);
      case CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED:
        return new StimulatorIoChangeData('output', 'on', data, offset);
      case CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED:
        return new StimulatorIoChangeData('output', 'off', data, offset);
      case CommandFromStimulator.COMMAND_INPUT_ACTIVATED:
        return new StimulatorIoChangeData('input', 'on', data, offset);
      case CommandFromStimulator.COMMAND_REQUEST_SEQUENCE_NEXT_PART:
        return new StimulatorNextSequencePartData(data, offset);
      case CommandFromStimulator.COMMAND_MEMORY:
        return new StimulatorMemoryData(data, offset);
      default:
        throw new UnsupportedStimulatorCommandException(data);
    }
  }
}
