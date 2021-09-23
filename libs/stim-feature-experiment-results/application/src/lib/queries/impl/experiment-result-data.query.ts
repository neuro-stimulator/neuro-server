import { IQuery } from '@nestjs/cqrs';

export class ExperimentResultDataQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly experimentResultID: number) {}
}
