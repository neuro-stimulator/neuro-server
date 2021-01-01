import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';
import { DataContainer, DataContainers, EntityStatistic, SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { SeedCommand } from '../impl/seed.command';

@CommandHandler(SeedCommand)
export class SeedHandler implements ICommandHandler<SeedCommand, SeedStatistics> {
  private readonly logger: Logger = new Logger(SeedHandler.name);

  constructor(private readonly service: SeederServiceProvider, private readonly facade: FileBrowserFacade) {}

  async execute(command: SeedCommand): Promise<SeedStatistics> {
    this.logger.debug('Budu seedovat databázi...');

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

    const seedStatistics: Record<string, EntityStatistic> = await this.service.seedDatabase(dataContainers);
    this.logger.debug(seedStatistics);
    return seedStatistics;
  }
}
