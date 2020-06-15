import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileWasDeletedEvent } from '@diplomka-backend/stim-feature-file-browser';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { FileAccessRestrictedException } from '../../../domain/exception';
import { DeleteFileCommand } from '../impl/delete-file.command';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler
  implements ICommandHandler<DeleteFileCommand, string> {
  private readonly logger: Logger = new Logger(DeleteFileHandler.name);
  constructor(
    private readonly service: FileBrowserService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: DeleteFileCommand): Promise<string> {
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = command.path.split('/');
    // Uložím si rodičovskou cestu složek
    const originalSubfolders = (subfolders.length >= 1
      ? subfolders.slice(0, subfolders.length - 1)
      : subfolders
    ).join('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.service.mergePublicPath(...subfolders);
    // Ověřím, že uživatel nepřistupuje mimo veřejnou složku
    if (!this.service.isPublicPathSecured(subfolderPath)) {
      // Pokud se snaží podvádět, tak mu to včas zatrhnu
      throw new FileAccessRestrictedException(subfolderPath);
    }

    // Provedu samotné mazání souborů v zadané složce
    this.service.recursiveDelete(subfolderPath);
    // Zvěřejním událost, že byl smazaný soubor
    this.eventBus.publish(new FileWasDeletedEvent(subfolderPath));
    // Nakonec vrátím rodičovskou složku smazané složky
    return originalSubfolders;
  }
}
