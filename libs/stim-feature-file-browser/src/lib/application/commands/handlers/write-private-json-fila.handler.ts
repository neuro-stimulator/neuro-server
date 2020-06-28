import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ContentWasNotWrittenException } from '../../../domain/exception/content-was-not-written.exception';
import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { WritePrivateJSONFileCommand } from '../impl/write-private-json-file.command';

@CommandHandler(WritePrivateJSONFileCommand)
export class WritePrivateJSONFilaHandler implements ICommandHandler<WritePrivateJSONFileCommand, void> {
  constructor(private readonly service: FileBrowserService) {}

  async execute(command: WritePrivateJSONFileCommand): Promise<void> {
    // Pokusím se zapsat obsah souboru
    // Zároveň získám informaci o úspěšnosti
    const success = this.service.writeFileContent(command.path, JSON.stringify(command.data));
    // Pokud se zápis nezdařil
    if (!success) {
      // Vyhodím vyjímku
      throw new ContentWasNotWrittenException(command.path, command.data);
    }
  }
}
