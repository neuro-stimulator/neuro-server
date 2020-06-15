import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { CreateNewFolderCommand } from '../impl/create-new-folder.command';
import {
  FileAccessRestrictedException,
  FileAlreadyExistsException,
} from '../../../domain/exception';
import { Logger } from '@nestjs/common';
import { FolderWasCreatedEvent } from "@diplomka-backend/stim-feature-file-browser";

@CommandHandler(CreateNewFolderCommand)
export class CreateNewFolderHandler
  implements ICommandHandler<CreateNewFolderCommand, [string, string]> {
  private readonly logger: Logger = new Logger(CreateNewFolderHandler.name);

  constructor(private readonly service: FileBrowserService,
              private readonly eventBus: EventBus) {}

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
    // Ověřím, že uživatel nepřistupuje mimo veřejnou složku
    if (!this.service.isPublicPathSecured(subfolderPath)) {
      // Pokud se snaží podvádět, tak mu to včas zatrhnu
      throw new FileAccessRestrictedException(subfolderPath);
    }

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
