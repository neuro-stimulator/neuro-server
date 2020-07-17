import { IQuery } from '@nestjs/cqrs';

export class UserByEmailQuery implements IQuery {
  constructor(public readonly email: string) {}
}
