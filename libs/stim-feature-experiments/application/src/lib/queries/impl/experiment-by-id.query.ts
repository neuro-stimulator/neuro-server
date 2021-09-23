import { IQuery } from '@nestjs/cqrs';

export class ExperimentByIdQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly experimentID: number) {}
}
