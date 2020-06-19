import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { SerialService } from '../../../domain/service/serial.service';
import { OpenCommand } from '../impl/open.command';

@CommandHandler(OpenCommand)
export class OpenHandler implements ICommandHandler<OpenCommand> {
  private readonly logger: Logger = new Logger(OpenHandler.name);

  constructor(private readonly service: SerialService) {}

  execute(command: OpenCommand): Promise<any> {
    this.logger.debug(
      `Budu otevírat sériovou linku na adrese: '${command.path}'.`
    );
    return this.service.open(command.path, {});
  }
}
