import { IQuery } from '@nestjs/cqrs';

export class ExperimentResultsAllQuery implements IQuery {
  constructor(public readonly userGroups: number[]) {}
}
