import { IQuery } from '@nestjs/cqrs';

export class ExperimentResultDataQuery implements IQuery {
  constructor(public readonly experimentResultID: number, public readonly userID: number) {}
}
