import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SerialService } from '../../../domain/service/serial.service';
import { CloseCommand } from '../impl/close.command';

@CommandHandler(CloseCommand)
export class CloseHandler implements ICommandHandler<CloseCommand> {
  constructor(private readonly service: SerialService) {}

  execute(command: CloseCommand): Promise<any> {
    return Promise.resolve(undefined);
  }
}
