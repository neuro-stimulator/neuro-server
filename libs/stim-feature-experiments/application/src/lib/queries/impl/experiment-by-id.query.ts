import { IQuery } from '@nestjs/cqrs';

export class ExperimentByIdQuery implements IQuery {
  constructor(public readonly experimentID: number, public readonly userID) {}
}
