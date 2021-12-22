import { ICommand } from '@nestjs/cqrs';

import { ExperimentType } from '@stechy1/diplomka-share';

import { DTO } from '@neuro-server/stim-lib-dto';

export class ExperimentsRegisterDtoCommand implements ICommand {
  constructor(public readonly dtos: Record<number, DTO<ExperimentType>>) {}
}
