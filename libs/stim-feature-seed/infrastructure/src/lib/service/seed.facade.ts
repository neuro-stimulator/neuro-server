import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SeedCommand, TruncateCommand } from '@neuro-server/stim-feature-seed/application';
import { SeedStatistics } from '@neuro-server/stim-feature-seed/domain';

@Injectable()
export class SeedFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async seed(): Promise<SeedStatistics> {
    return this.commandBus.execute(new SeedCommand());
  }

  public async truncate(): Promise<SeedStatistics> {
    return this.commandBus.execute(new TruncateCommand());
  }
}
