import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DatabaseDump, DataContainer } from '@neuro-server/stim-feature-seed/domain';

import { DatabaseDumpService } from '../../service/database-dump.service';
import { DatabaseDumpCommand } from '../impl/database-dump.command';

@CommandHandler(DatabaseDumpCommand)
export class DatabaseDumpHandler implements ICommandHandler<DatabaseDumpCommand> {
  private readonly logger: Logger = new Logger(DatabaseDumpHandler.name);

  constructor(private readonly service: DatabaseDumpService) {}

  async execute(command: DatabaseDumpCommand): Promise<void> {
    const dump: DatabaseDump = await this.service.dumpDatabase();

    for (const entity of Object.keys(dump)) {
      if (dump[entity].length === 0) continue;
      const fileName = DatabaseDumpHandler.dasherize(entity.replace('Entity', ''));
      const containerPath = path.join(command.outputDirectory, fileName) + '.json';
      const dataContainer: DataContainer = {
        entityName: entity,
        entities: dump[entity],
      };
      fs.writeFileSync(containerPath, JSON.stringify(dataContainer), { encoding: 'utf-8' });
    }
  }

  private static dasherize(text: string): string {
    return text
      .replace(/\.?([A-Z]+)/g, function (x, y) {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '');
  }
}
