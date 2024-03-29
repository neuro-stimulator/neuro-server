import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TriggersService } from '../../service/triggers.service';
import { EnableTriggersCommand } from '../impl/enable-triggers.command';

@CommandHandler(EnableTriggersCommand)
export class EnableTriggersHandler implements ICommandHandler<EnableTriggersCommand, void> {
  private readonly logger: Logger = new Logger(EnableTriggersHandler.name);

  constructor(private readonly service: TriggersService) {}

  async execute(command: EnableTriggersCommand): Promise<void> {
    if (command.triggerNames !== undefined && command.triggerNames.length !== 0) {
      this.logger.debug('Budu aktivovat pouze vybrané triggery.');
      for (const triggerName of command.triggerNames) {
        try {
          await this.service.enable(triggerName);
        } catch (e) {
          this.logger.error(`Nepodařilo se aktivovat trigger: '${triggerName}'!`);
          this.logger.error(e);
        }
      }
    } else {
      this.logger.debug('Budu aktivovat všechny triggery.');
      try {
        await this.service.enableAll();
      } catch (e) {
        this.logger.error('Nepodařilo se aktivovat všechny triggery!');
        this.logger.error(e);
      }
    }
  }
}
