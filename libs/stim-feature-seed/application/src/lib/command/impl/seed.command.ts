import { ICommand } from '@nestjs/cqrs';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

export class SeedCommand implements ICommand {
  /**
   * @param datacontainers Pouze pro účely testování!!!
   */
  constructor(public readonly datacontainers?: DataContainers) {}
}
