import { IQuery } from '@nestjs/cqrs';

export class ParseStimulatorDataQuery implements IQuery {
  constructor(public readonly buffer: Buffer) {}
}
