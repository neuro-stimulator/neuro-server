import { ICommand } from '@nestjs/cqrs';

import { DTO } from '@neuro-server/stim-lib-common';

export class RegisterDtoCommand implements ICommand {
  constructor(public readonly dtos: Record<string, DTO>) {}
}
