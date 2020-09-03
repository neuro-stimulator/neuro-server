import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorSetOutputCommand } from '../impl/stimulator-set-output.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';
import { CommandIdService } from '../../service/command-id.service';

@CommandHandler(StimulatorSetOutputCommand)
export class StimulatorSetOutputHandler extends BaseStimulatorBlockingHandler<StimulatorSetOutputCommand> {
  constructor(private readonly service: StimulatorService, commandIdService: CommandIdService, eventBus: EventBus) {
    super(eventBus, commandIdService, new Logger(StimulatorSetOutputHandler.name));
  }

  protected init() {
    this.logger.debug('Budu nastavovat intenzitu jasu jednoho výstupu.');
  }

  protected done(event: StimulatorEvent) {}

  protected async callServiceMethod(command: StimulatorSetOutputCommand, commandID: number): Promise<void> {
    this.service.toggleLed(commandID, command.index, command.enabled ? 100 : 0);
    return Promise.resolve();
  }

  protected isValid(event: StimulatorEvent): boolean {
    return false;
  }
}
