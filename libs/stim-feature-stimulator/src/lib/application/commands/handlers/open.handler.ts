import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SerialService } from '../../../domain/service/serial.service';
import { OpenCommand } from '../impl/open.command';

@CommandHandler(OpenCommand)
export class OpenHandler implements ICommandHandler<OpenCommand> {
  constructor(private readonly service: SerialService) {}

  execute(command: OpenCommand): Promise<any> {
    return this.service.open(command.path, {});
  }
}
