import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FirmwareUpdateCommand } from '../../application/commands';
import { GetCurrentExperimentIdQuery } from '../../application/queries';

export class StimulatorFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async updateFirmware(path: string) {
    return this.commandBus.execute(new FirmwareUpdateCommand(path));
  }

  async getCurrentExperimentID(): Promise<number> {
    return this.queryBus.execute(new GetCurrentExperimentIdQuery());
  }
}
