import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TriggersService } from '../../service/triggers.service';
import { DisableTriggersCommand } from '../impl/disable-triggers.command';

@CommandHandler(DisableTriggersCommand)
export class DisableTriggersHandler implements ICommandHandler<DisableTriggersCommand, void> {
  private readonly logger: Logger = new Logger(DisableTriggersHandler.name);

  constructor(private readonly service: TriggersService) {}

  async execute(command: DisableTriggersCommand): Promise<void> {
    if (command.triggerNames !== undefined && command.triggerNames.length !== 0) {
      this.logger.debug('Budu deaktivovat pouze vybrané triggery.');
      for (const triggerName of command.triggerNames) {
        await this.service.disable(triggerName);
      }
    } else {
      this.logger.debug('Budu deaktivovat všechny triggery.');
      await this.service.disableAll();
    }
  }
}
