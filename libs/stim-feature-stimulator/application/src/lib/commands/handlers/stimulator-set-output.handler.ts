import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorSetOutputCommand } from '../impl/stimulator-set-output.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(StimulatorSetOutputCommand)
export class StimulatorSetOutputHandler extends BaseStimulatorBlockingHandler<StimulatorSetOutputCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(StimulatorSetOutputHandler.name));
  }

  protected async init(command: StimulatorSetOutputCommand): Promise<void> {
    this.logger.debug('Budu nastavovat intenzitu jasu jednoho výstupu.');
    return super.init(command);
  }

  protected done(event: StimulatorEvent): void {
    this.logger.debug('Výstup byl úspěšně nastaven.');
  }

  protected async callServiceMethod(command: StimulatorSetOutputCommand, commandID: number): Promise<void> {
    this.service.toggleLed(commandID, command.index, command.enabled ? 100 : 0);
    return Promise.resolve();
  }

  protected isValid(event: StimulatorEvent): boolean {
    return false;
  }
}
