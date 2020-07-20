import { IQuery } from '@nestjs/cqrs';

export class ExperimentResultNameExistsQuery implements IQuery {
  constructor(
    public readonly name: string,
    public readonly expeirmentResultID: number
  ) {}
}
