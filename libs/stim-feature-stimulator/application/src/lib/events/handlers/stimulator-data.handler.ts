import { Logger } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { LOG_TAG, StimulatorData, UnsupportedStimulatorCommandException } from '@neuro-server/stim-feature-stimulator/domain';

import { ParseStimulatorDataQuery } from '../../queries/impl/parse-stimulator-data.query';
import { StimulatorDataEvent } from '../impl/stimulator-data.event';
import { StimulatorEvent } from '../impl/stimulator.event';

@EventsHandler(StimulatorDataEvent)
export class StimulatorDataHandler implements IEventHandler<StimulatorDataEvent> {
  private readonly logger: Logger = new Logger(StimulatorDataHandler.name);
  constructor(private readonly queryBus: QueryBus, private readonly eventBus: EventBus) {}

  async handle(event: StimulatorDataEvent): Promise<void> {
    this.logger.log({ message: `Přišel nový příkaz ze stimulátoru: [${event.buffer.join(',')}]`, label: LOG_TAG });
    try {
      // Nechám naparsovat příchozí data
      const [commandID, data]: [number, StimulatorData] = await this.queryBus.execute(new ParseStimulatorDataQuery(event.buffer));

      this.logger.debug({ message: `Příkaz s id: '${commandID}' je typu: '${data.name}'.`, label: LOG_TAG });
      this.logger.debug({ message: data.toString(), label: 'serial' });
      this.logger.debug('Publikuji novou událost s příkazem ze stimulátoru.');
      // Publikuji novou událost s již naparsovanými daty
      this.eventBus.publish(new StimulatorEvent(commandID, data));
    } catch (e) {
      if (e instanceof UnsupportedStimulatorCommandException) {
        this.logger.error('Ze stimulátoru přišel neznámý příkaz.');
        this.logger.error(e);
      } else {
        this.logger.error('Vyskytla se neznámá chyba při zpracování příkazu ze stimulátoru!');
        this.logger.error(e);
      }
    }
  }
}
