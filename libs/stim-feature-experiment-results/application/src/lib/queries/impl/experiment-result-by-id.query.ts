import { IQuery } from '@nestjs/cqrs';

export class ExperimentResultByIdQuery implements IQuery {
  constructor(public readonly experimentResultID: number) {}
}
