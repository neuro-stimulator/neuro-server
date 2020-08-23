import { IQuery } from '@nestjs/cqrs';

export class ExperimentsAllQuery implements IQuery {
  constructor(public readonly userID: number) {}
}
