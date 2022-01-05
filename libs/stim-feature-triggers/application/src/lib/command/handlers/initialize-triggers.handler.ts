import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { FileRecord } from '@stechy1/diplomka-share';

import { TriggersService } from '../../service/triggers.service';
import { InitializeTriggersCommand } from '../impl/initialize-triggers.command';
import { GetContentQuery } from '@neuro-server/stim-feature-file-browser/application';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

@CommandHandler(InitializeTriggersCommand)
export class InitializeTriggersHandler implements ICommandHandler<InitializeTriggersCommand, void> {
  private readonly logger: Logger = new Logger(InitializeTriggersHandler.name);

  constructor(private readonly service: TriggersService, private readonly queryBus: QueryBus) {}

  async execute(command: InitializeTriggersCommand): Promise<void> {
    this.logger.debug('Budu inicializovat triggery.');
    this.logger.debug('1. Načtu všechny triggery.');

    let triggersDirectoryFiles: FileRecord[];
    try {
      triggersDirectoryFiles = await this.queryBus.execute(new GetContentQuery('triggers', 'private')) as FileRecord[];
    } catch (e) {
      this.logger.error('Nepodařilo se načíst obsah složky s triggery!');
      if (e instanceof FileNotFoundException) {
        this.logger.error(`Cesta k triggerům: '${e.path}'.`);
      }
      return;
    }

    const triggers = await Promise.all(
      triggersDirectoryFiles.filter((record: FileRecord) => record.name.endsWith('.trigger.sql'))
                            .map((record: FileRecord) => this.queryBus.execute(new GetContentQuery(record.path, 'private')))
    );

    // Pokud jsem načetl nějaké triggery
    if (Array.isArray(triggers) && triggers.length !== 0) {
      // Uložím si je do pomocné proměnné
      let content;
      // Pokud jsem dostal ReadStream, tak ho převedu na řetězec
      if (typeof triggers[0] !== 'string' && triggers[0] instanceof fs.ReadStream) {
        content = await Promise.all(triggers.map((stream: fs.ReadStream) => this._streamToString(stream)));
      } else {
        content = triggers.map((pathToTrigger: string) => fs.readFileSync(pathToTrigger, { encoding: 'utf8' }));
      }

      // Nakonec zavolám službu, která inicializuje jednotlivé triggery
      await this.service.initializeTriggers(content as string[]);
    }
  }

  private async _streamToString(stream: fs.ReadStream): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }
}
