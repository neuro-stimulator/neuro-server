import { IQuery } from '@nestjs/cqrs';

export class SequenceNameExistsQuery implements IQuery {
  constructor(
    public readonly name: string,
    public readonly expeirmentID: number | 'new'
  ) {}
}
