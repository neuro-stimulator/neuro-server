import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorSetOutputCommand } from '../impl/stimulator-set-output.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(StimulatorSetOutputCommand)
export class StimulatorSetOutputHandler extends BaseStimulatorBlockingHandler<StimulatorSetOutputCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, eventBus, commandIdService, new Logger(StimulatorSetOutputHandler.name));
  }

  protected init() {
    this.logger.debug('Budu nastavovat intenzitu jasu jednoho výstupu.');
  }

  protected done(event: StimulatorEvent) {
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
