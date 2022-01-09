import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../service/file-browser.service';
import { WritePrivateJSONFileCommand } from '../impl/write-private-json-file.command';

@CommandHandler(WritePrivateJSONFileCommand)
export class WritePrivateJsonFileHandler implements ICommandHandler<WritePrivateJSONFileCommand, void> {
  constructor(private readonly service: FileBrowserService) {}

  async execute(command: WritePrivateJSONFileCommand): Promise<void> {
    // Pokusím se zapsat obsah souboru
    // Pokud se zápis nezdaři, service vyhodí vyjímku
    await this.service.writeFileContent(command.path, JSON.stringify(command.data));
  }
}
