import { IQuery } from '@nestjs/cqrs';

export class MergePrivatePathQuery implements IQuery {
  constructor(public readonly path: string) {}
}
