import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { StimulatorStateData } from '../../../domain/model/stimulator-command-data/stimulator-state.data';
import { CommandIdService } from '../../../domain/service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorStateCommand } from '../impl/stimulator-state.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(StimulatorStateCommand)
export class StimulatorStateHandler extends BaseStimulatorBlockingHandler<StimulatorStateCommand> {
  constructor(eventBus: EventBus, commandIdService: CommandIdService, private readonly service: StimulatorService) {
    super(eventBus, commandIdService, new Logger(StimulatorStateHandler.name));
  }

  protected callServiceMethod(command: StimulatorStateCommand, commandID: number) {
    this.service.stimulatorState(commandID);
  }

  protected init() {
    this.logger.debug('Budu získávat stav stimulátoru.');
  }

  protected done() {
    this.logger.debug('Získal jsem stav stimulátoru.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
