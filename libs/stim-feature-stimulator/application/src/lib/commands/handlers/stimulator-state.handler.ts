import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorStateCommand } from '../impl/stimulator-state.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(StimulatorStateCommand)
export class StimulatorStateHandler extends BaseStimulatorBlockingHandler<StimulatorStateCommand> {
  constructor(eventBus: EventBus, commandIdService: CommandIdService, private readonly service: StimulatorService) {
    super(eventBus, commandIdService, new Logger(StimulatorStateHandler.name));
  }

  protected callServiceMethod(command: StimulatorStateCommand, commandID: number): Promise<void> {
    this.service.stimulatorState(commandID);
    return Promise.resolve();
  }

  protected init() {
    this.logger.debug('Budu získávat stav stimulátoru.');
  }

  protected done(event: StimulatorEvent) {
    this.logger.debug('Získal jsem stav stimulátoru.');
    this.service.lastKnownStimulatorState = (event.data as StimulatorStateData).state;
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
