import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequencesAllQuery } from '../../application/queries/impl/sequences-all.query';
import { SequenceByIdQuery } from '../../application/queries/impl/sequence-by-id.query';
import { SequenceValidateCommand } from '../../application/commands/impl/sequence-validate.command';
import { SequenceInsertCommand } from '../../application/commands/impl/sequence-insert.command';
import { SequenceUpdateCommand } from '../../application/commands/impl/sequence-update.command';
import { SequenceDeleteCommand } from '../../application/commands/impl/sequence-delete.command';
import { SequenceNameExistsQuery } from '../../application/queries/impl/sequence-name-exists.query';
import { SequencesForExperimentQuery } from '../../application/queries/impl/sequences-for-experiment.query';
import { SequenceGenerateCommand } from '../../application/commands/impl/sequence-generate.command';

@Injectable()
export class SequencesFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async sequencesAll(): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesAllQuery());
  }

  public async sequenceById(sequenceID: number): Promise<Sequence> {
    return this.queryBus.execute(new SequenceByIdQuery(sequenceID));
  }

  public async validate(sequence: Sequence): Promise<boolean> {
    return this.commandBus.execute(new SequenceValidateCommand(sequence));
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

  public async nameExists(name: string, sequenceID: number | 'new'): Promise<boolean> {
    return this.queryBus.execute(new SequenceNameExistsQuery(name, sequenceID));
  }

  public async sequencesForExperiment(experimentID: number): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesForExperimentQuery(experimentID));
  }

  public async generateSequenceForExperiment(experimentID: number, size: number): Promise<number[]> {
    return this.queryBus.execute(new SequenceGenerateCommand(experimentID, size));
  }
}
