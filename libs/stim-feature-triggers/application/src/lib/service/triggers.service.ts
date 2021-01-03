import { Injectable, Logger } from '@nestjs/common';

import { TriggersRepository } from '@diplomka-backend/stim-feature-triggers/domain';

@Injectable()
export class TriggersService {
  private readonly logger = new Logger(TriggersService.name);

  private readonly TRIGGER_NAME_REGEX = /(?<triggerName>[a-z_]+)/;

  constructor(private readonly repository: TriggersRepository) {}

  public async initializeTriggers(triggers: string[]): Promise<void> {
    this.logger.verbose('Inicializuji triggery...');

    for (const trigger of triggers) {
      const found = trigger.match(this.TRIGGER_NAME_REGEX);
      if (found.length !== 0) {
        const triggerName = found.groups.triggerName;
        this.logger.verbose(`Zpracovávám trigger: '${triggerName}'`);
        if (!(await this.repository.exists(triggerName))) {
          await this.repository.insert(triggerName, trigger);
        }
      }
    }
  }

  public async enable(name: string): Promise<void> {
    await this.repository.toggleTrigger(name, true);
  }

  public async enableAll(): Promise<void> {
    await this.repository.toggleTriggers(true);
  }

  public async disable(name: string): Promise<void> {
    await this.repository.toggleTrigger(name, false);
  }

  public async disableAll(): Promise<void> {
    await this.repository.toggleTriggers(false);
  }
}
