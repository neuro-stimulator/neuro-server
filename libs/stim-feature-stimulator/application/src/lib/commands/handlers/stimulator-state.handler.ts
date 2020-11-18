import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorStateCommand } from '../impl/stimulator-state.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(StimulatorStateCommand)
export class StimulatorStateHandler extends BaseStimulatorBlockingHandler<StimulatorStateCommand> {
  constructor(eventBus: EventBus, settings: SettingsFacade, commandIdService: CommandIdService, private readonly service: StimulatorService) {
    super(settings, commandIdService, eventBus, new Logger(StimulatorStateHandler.name));
  }

  protected callServiceMethod(command: StimulatorStateCommand, commandID: number): Promise<void> {
    this.service.stimulatorState(commandID);
    return Promise.resolve();
  }

  protected async init(command: StimulatorStateCommand): Promise<void> {
    this.logger.debug('Budu získávat stav stimulátoru.');
    return super.init(command);
  }

  protected done(event: StimulatorEvent): void {
    this.logger.debug('Získal jsem stav stimulátoru.');
    this.service.lastKnownStimulatorState = (event.data as StimulatorStateData).state;
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
