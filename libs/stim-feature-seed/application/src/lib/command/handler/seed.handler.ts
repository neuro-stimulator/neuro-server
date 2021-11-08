import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@neuro-server/stim-feature-file-browser';
import { DataContainer, DataContainers, EntityStatistic, SeedStatistics } from '@neuro-server/stim-feature-seed/domain';
import { DisableTriggersCommand, EnableTriggersCommand, InitializeTriggersCommand } from '@neuro-server/stim-feature-triggers/application';

import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { SeedCommand } from '../impl/seed.command';

@CommandHandler(SeedCommand)
export class SeedHandler implements ICommandHandler<SeedCommand, SeedStatistics> {
  private readonly logger: Logger = new Logger(SeedHandler.name);

  constructor(private readonly service: SeederServiceProvider, private readonly facade: FileBrowserFacade, private readonly commandBus: CommandBus) {}

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
        const dataContainerFiles = (await this.facade.getContent('data-containers', 'private')) as FileRecord[];
        for (const dataContainerFile of dataContainerFiles) {
          const dataContainer: DataContainer = await this.facade.readPrivateJSONFile<DataContainer>(`${dataContainerFile.path}`);
          if (!dataContainers[dataContainer.entityName]) {
            dataContainers[dataContainer.entityName] = [];
          }
          dataContainers[dataContainer.entityName].push(dataContainer);
        }
      }

      this.logger.debug('3. Nahraji datakontejnery do databáze.');
      const seedStatistics: Record<string, EntityStatistic> = await this.service.seedDatabase(dataContainers);
      this.logger.debug(seedStatistics);
      return seedStatistics;
    } finally {
      await this.commandBus.execute(new InitializeTriggersCommand());
      this.logger.debug('4. Opět aktivuji veškeré triggery.');
      await this.commandBus.execute(new EnableTriggersCommand());
    }
  }
}
