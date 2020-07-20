import { IQuery } from '@nestjs/cqrs';

export class UserByIdQuery implements IQuery {
  constructor(public readonly userID: number) {}
}
