import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { TruncateCommand } from '../impl/truncate.command';

@CommandHandler(TruncateCommand)
export class TruncateHandler implements ICommandHandler<TruncateCommand, SeedStatistics> {
  private readonly logger: Logger = new Logger(TruncateHandler.name);

  constructor(private readonly service: SeederServiceProvider) {}

  async execute(command: TruncateCommand): Promise<SeedStatistics> {
    this.logger.debug('Budu mazat obsah celé databáze!');
    return await this.service.truncateDatabase();
  }
}
