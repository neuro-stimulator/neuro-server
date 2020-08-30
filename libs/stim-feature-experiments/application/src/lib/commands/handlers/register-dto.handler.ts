import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { DtoFactory } from '@diplomka-backend/stim-lib-common';
import { DTOs } from '@diplomka-backend/stim-feature-experiments/domain';

import { RegisterDtoCommand } from '../impl/register-dto.command';
import { ClassType } from 'class-transformer-validator';

@CommandHandler(RegisterDtoCommand)
export class RegisterDtoHandler implements ICommandHandler<RegisterDtoCommand, void> {
  private readonly logger: Logger = new Logger(RegisterDtoHandler.name);

  constructor(private readonly factory: DtoFactory) {}

  async execute(command: RegisterDtoCommand): Promise<void> {
    this.logger.debug('Budu registrovat DTO pro experimenty.');
    for (const [key, entry] of Object.entries(DTOs)) {
      this.factory.registerDTO(key, entry as ClassType<any>);
    }
  }
}
