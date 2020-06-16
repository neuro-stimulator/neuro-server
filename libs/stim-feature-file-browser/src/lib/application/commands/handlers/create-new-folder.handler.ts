import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { FileAlreadyExistsException } from '../../../domain/exception';
import { FolderWasCreatedEvent } from '../../events/impl/folder-was-created.event';
import { CreateNewFolderCommand } from '../impl/create-new-folder.command';

@CommandHandler(CreateNewFolderCommand)
export class CreateNewFolderHandler
  implements ICommandHandler<CreateNewFolderCommand, [string, string]> {
  private readonly logger: Logger = new Logger(CreateNewFolderHandler.name);

  constructor(
    private readonly service: FileBrowserService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateNewFolderCommand): Promise<[string, string]> {
    const folderName = command.path.substring(command.path.lastIndexOf('/'));
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = command.path.split('/');
    // Uložím si cestu k rodičovské složce
    const originalSubfolders = subfolders
      .slice(0, subfolders.length - 1)
      .join('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.service.mergePublicPath(...subfolders);

    // Ověřím, že složka ještě neexistuje
    if (this.service.existsFile(subfolderPath)) {
      throw new FileAlreadyExistsException(subfolderPath);
    }
    // Když je vše v pořádku, vytvořím novou složku
    await this.service.createDirectory(subfolderPath, true);
    // Zveřejním událost, že byla vytvořena nová složka
    this.eventBus.publish(new FolderWasCreatedEvent(subfolderPath));
    // Vrátím cestu k rodičovské složce
    return [originalSubfolders, folderName];
  }
}
