import { IQuery } from '@nestjs/cqrs';

export class GetAclByRoleQuery implements IQuery {
  constructor(public readonly roleIds: number[]) {
  }
}
