import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { DiscoverQuery, OpenCommand, CloseCommand, GetStimulatorConnectionStatusQuery } from '@diplomka-backend/stim-feature-stimulator/application';

@Injectable()
export class SerialFacade {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  public async discover(): Promise<Record<string, unknown>[]> {
    return this.queryBus.execute(new DiscoverQuery());
  }

  public async open(path: string): Promise<void> {
    return this.commandBus.execute(new OpenCommand(path));
  }

  public async close(): Promise<void> {
    return this.commandBus.execute(new CloseCommand());
  }

  public async status(): Promise<boolean> {
    return this.queryBus.execute(new GetStimulatorConnectionStatusQuery());
  }
}
