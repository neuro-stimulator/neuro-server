import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SeedCommand } from '@diplomka-backend/stim-feature-seed/application';
import { SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

@Injectable()
export class SeedFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async seed(): Promise<SeedStatistics> {
    return await this.commandBus.execute(new SeedCommand());
  }
}
