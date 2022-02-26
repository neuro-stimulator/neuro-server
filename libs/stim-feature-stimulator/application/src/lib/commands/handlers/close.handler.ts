import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SerialService } from '../../service/serial.service';
import { CloseCommand } from '../impl/close.command';

@CommandHandler(CloseCommand)
export class CloseHandler implements ICommandHandler<CloseCommand> {
  private readonly logger: Logger = new Logger(CloseHandler.name);

  constructor(private readonly service: SerialService) {}

  async execute(command: CloseCommand): Promise<any> {
    this.logger.debug('Budu zavírat sériovou linku.');
    await this.service.close();
  }
}
