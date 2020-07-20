import { IQuery } from '@nestjs/cqrs';

export class ExperimentNameExistsQuery implements IQuery {
  constructor(
    public readonly name: string,
    public readonly expeirmentID: number | 'new'
  ) {}
}
