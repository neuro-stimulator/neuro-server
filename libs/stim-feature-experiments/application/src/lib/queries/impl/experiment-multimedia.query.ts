import { IQuery } from '@nestjs/cqrs';

export class ExperimentMultimediaQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly experimentID: number) {}
}
