import { IQuery } from '@nestjs/cqrs';

export class MergePublicPathQuery implements IQuery {
  constructor(public readonly path: string, public readonly exceptionIfNotFound?: boolean) {}
}
