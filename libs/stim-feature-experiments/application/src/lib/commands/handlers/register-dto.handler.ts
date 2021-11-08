import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ClassType } from 'class-transformer-validator';

import { DtoFactory } from '@neuro-server/stim-lib-common';

import { RegisterDtoCommand } from '../impl/register-dto.command';

@CommandHandler(RegisterDtoCommand)
export class RegisterDtoHandler implements ICommandHandler<RegisterDtoCommand, void> {
  private readonly logger: Logger = new Logger(RegisterDtoHandler.name);

  constructor(private readonly factory: DtoFactory) {}

  async execute(command: RegisterDtoCommand): Promise<void> {
    this.logger.debug('Budu registrovat DTO pro experimenty.');
    for (const [key, entry] of Object.entries(command.dtos)) {
      this.factory.registerDTO(key, entry as ClassType<unknown>);
    }
  }
}
