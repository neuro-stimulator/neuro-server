import { IQuery } from '@nestjs/cqrs';

export class SequencesForExperimentQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly experimentID: number) {}
}
