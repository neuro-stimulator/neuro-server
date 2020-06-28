import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { StimulatorStateData } from '../../../domain/model/stimulator-command-data/stimulator-state.data';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorStateCommand } from '../impl/stimulator-state.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(StimulatorStateCommand)
export class StimulatorStateHandler extends BaseStimulatorBlockingHandler<StimulatorStateCommand> {
  constructor(eventBus: EventBus, private readonly service: StimulatorService) {
    super(eventBus, new Logger(StimulatorStateHandler.name));
  }

  protected callServiceMethod() {
    this.service.stimulatorState();
  }

  protected init() {
    this.logger.debug('Budu získávat stav stimulátoru.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
