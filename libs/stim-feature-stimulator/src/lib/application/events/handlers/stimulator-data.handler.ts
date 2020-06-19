import { EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { StimulatorData } from '../../../domain/model/stimulator-command-data';
import { UnsupportedStimulatorCommandException } from '../../../domain/exception';
import { ParseStimulatorDataQuery } from '../../queries/impl/parse-stimulator-data.query';
import { StimulatorDataEvent } from '../impl/stimulator-data.event';
import { StimulatorEvent } from '../impl/stimulator.event';

@EventsHandler(StimulatorDataEvent)
export class StimulatorDataHandler
  implements IEventHandler<StimulatorDataEvent> {
  private readonly logger: Logger = new Logger(StimulatorDataHandler.name);
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus
  ) {}

  async handle(event: StimulatorDataEvent): Promise<any> {
    this.logger.debug('Přišel nový příkaz se stimulátoru');
    try {
      // Nechám naparsovat příchozí data
      const data: StimulatorData = await this.queryBus.execute(
        new ParseStimulatorDataQuery(event.buffer)
      );

      this.logger.debug(`Příkaz je typu: '${data.name}'.`);
      // Publikuji novou událost s již naparsovanými daty
      this.eventBus.publish(new StimulatorEvent(data));
    } catch (e) {
      if (e instanceof UnsupportedStimulatorCommandException) {
        this.logger.error('Ze stimulátoru přišel neznámý příkaz.');
      }
      this.logger.error(e);
    }
  }
}
