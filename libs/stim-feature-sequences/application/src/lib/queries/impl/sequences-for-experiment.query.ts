import { IQuery } from '@nestjs/cqrs';

export class SequencesForExperimentQuery implements IQuery {
  constructor(public readonly experimentID: number) {}
}
