import { CommandBus } from '@nestjs/cqrs';

import { FirmwareUpdateCommand } from '../../application/commands';

export class StimulatorFacade {
  constructor(private readonly commandBus: CommandBus) {}

  async updateFirmware(path: string) {
    return this.commandBus.execute(new FirmwareUpdateCommand(path));
  }
}
