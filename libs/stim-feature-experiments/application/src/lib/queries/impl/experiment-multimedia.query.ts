import { IQuery } from '@nestjs/cqrs';

export class ExperimentMultimediaQuery implements IQuery {
  constructor(public readonly experimentID: number) {}
}
