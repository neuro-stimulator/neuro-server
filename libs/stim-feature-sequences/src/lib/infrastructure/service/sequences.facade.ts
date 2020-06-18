import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import {
  SequencesAllQuery,
  SequenceByIdQuery,
  SequenceNameExistsQuery,
  SequencesForExperimentQuery,
} from '../../application/queries';
import {
  SequenceDeleteCommand,
  SequenceGenerateCommand,
  SequenceInsertCommand,
  SequenceUpdateCommand,
} from '../../application/commands';

@Injectable()
export class SequencesFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  public async sequencesAll(): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesAllQuery());
  }

  public async sequenceByID(sequenceID: number): Promise<Sequence> {
    return this.queryBus.execute(new SequenceByIdQuery(sequenceID));
  }

  public async insert(sequence: Sequence): Promise<number> {
    return this.commandBus.execute(new SequenceInsertCommand(sequence));
  }

  public async update(sequence: Sequence): Promise<void> {
    return this.commandBus.execute(new SequenceUpdateCommand(sequence));
  }

  public async delete(sequenceID: number): Promise<void> {
    return this.commandBus.execute(new SequenceDeleteCommand(sequenceID));
  }

  public async nameExists(
    name: string,
    sequenceID: number | 'new'
  ): Promise<boolean> {
    return this.queryBus.execute(new SequenceNameExistsQuery(name, sequenceID));
  }

  public async sequencesForExperiment(
    experimentID: number
  ): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesForExperimentQuery(experimentID));
  }

  public async generateSequenceForExperiment(
    experimentID: number,
    size: number
  ): Promise<number[]> {
    return this.queryBus.execute(
      new SequenceGenerateCommand(experimentID, size)
    );
  }
}
