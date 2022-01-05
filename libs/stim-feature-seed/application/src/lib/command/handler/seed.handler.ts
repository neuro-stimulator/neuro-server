import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileRecord } from '@stechy1/diplomka-share';

import { DataContainer, DataContainers, EntityStatisticsSerializer, SeedStatistics } from '@neuro-server/stim-feature-seed/domain';
import { DisableTriggersCommand, EnableTriggersCommand, InitializeTriggersCommand } from '@neuro-server/stim-feature-triggers/application';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';
import { GetContentQuery, ReadPrivateJSONFileQuery } from '@neuro-server/stim-feature-file-browser/application';

import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { SeedCommand } from '../impl/seed.command';

@CommandHandler(SeedCommand)
export class SeedHandler implements ICommandHandler<SeedCommand, SeedStatistics> {
  private readonly logger: Logger = new Logger(SeedHandler.name);

  constructor(private readonly service: SeederServiceProvider,
              private readonly entityStatisticsSerializer: EntityStatisticsSerializer,
              private readonly queryBus: QueryBus,
              private readonly commandBus: CommandBus
  ) {}

  async execute(command: SeedCommand): Promise<SeedStatistics> {
    this.logger.debug('Budu seedovat databázi...');
    this.logger.debug('1. Nechám vypnout všechny triggery.');
    await this.commandBus.execute(new DisableTriggersCommand());

    this.logger.debug('2. Načtu datakontejnery');
    try {
      let dataContainers: DataContainers = {};
      if (command.datacontainers) {
        dataContainers = command.datacontainers;
      } else {
        let dataContainerFiles: FileRecord[];
        try {
          dataContainerFiles = await this.queryBus.execute(new GetContentQuery('data-containers', 'private'));
        } catch (e) {
          this.logger.error('Nepodařilo se načíst obsah složky s data kontejnery!');
          if (e instanceof FileNotFoundException) {
            this.logger.error(`Cesta k data kontejnerům: '${e.path}'.`);
          }
          // vrátím prázdný objekt reprezentující seed statistiky
          return {};
        }
        for (const dataContainerFile of dataContainerFiles) {
          const dataContainer: DataContainer = await this.queryBus.execute(new ReadPrivateJSONFileQuery(`${dataContainerFile.path}`));
          if (!dataContainers[dataContainer.entityName]) {
            dataContainers[dataContainer.entityName] = [];
          }
          dataContainers[dataContainer.entityName].push(dataContainer);
        }
      }

      this.logger.debug('3. Nahraji datakontejnery do databáze.');
      const seedStatistics: SeedStatistics = await this.service.seedDatabase(dataContainers);
      this.logger.debug(this.entityStatisticsSerializer.serialize(seedStatistics));
      return seedStatistics;
    } finally {
      await this.commandBus.execute(new InitializeTriggersCommand());
      this.logger.debug('4. Opět aktivuji veškeré triggery.');
      await this.commandBus.execute(new EnableTriggersCommand());
    }
  }
}
