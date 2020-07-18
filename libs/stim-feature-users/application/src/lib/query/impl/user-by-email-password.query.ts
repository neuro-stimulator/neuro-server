import { IQuery } from '@nestjs/cqrs';

export class UserByEmailPasswordQuery implements IQuery {
  constructor(public readonly email: string, public readonly password: string) {}
}
