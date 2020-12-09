import { ICommand } from '@nestjs/cqrs';

import { DTO } from '@diplomka-backend/stim-lib-common';

export class RegisterDtoCommand implements ICommand {
  constructor(public readonly dtos: Record<string, DTO>) {}
}
