import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Experiment, Output, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsAllQuery } from '@diplomka-backend/stim-feature-experiments/application';
import {
  SequencesAllQuery,
  SequenceByIdQuery,
  SequenceValidateCommand,
  SequenceInsertCommand,
  SequenceUpdateCommand,
  SequenceDeleteCommand,
  SequenceNameExistsQuery,
  SequencesForExperimentQuery,
  SequenceGenerateCommand,
} from '@diplomka-backend/stim-feature-sequences/application';

@Injectable()
export class SequencesFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async sequencesAll(userGroups: number[]): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesAllQuery(userGroups));
  }

  public async sequenceById(userGroups: number[], sequenceID: number): Promise<Sequence> {
    return this.queryBus.execute(new SequenceByIdQuery(userGroups, sequenceID));
  }

  public async validate(sequence: Sequence): Promise<boolean> {
    return this.commandBus.execute(new SequenceValidateCommand(sequence));
  }

  public async insert(userId: number, sequence: Sequence): Promise<number> {
    return this.commandBus.execute(new SequenceInsertCommand(userId, sequence));
  }

  public async update(userGroups: number[], sequence: Sequence): Promise<void> {
    return this.commandBus.execute(new SequenceUpdateCommand(userGroups, sequence));
  }

  public async delete(userGroups: number[], sequenceID: number): Promise<void> {
    return this.commandBus.execute(new SequenceDeleteCommand(userGroups, sequenceID));
  }

  public async nameExists(name: string, sequenceID: number | 'new'): Promise<boolean> {
    return this.queryBus.execute(new SequenceNameExistsQuery(name, sequenceID));
  }

  public async sequencesForExperiment(userGroups: number[], experimentID: number): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesForExperimentQuery(userGroups, experimentID));
  }

  public async generateSequenceForExperiment(userGroups: number[], experimentID: number, size: number): Promise<number[]> {
    return this.commandBus.execute(new SequenceGenerateCommand(userGroups, experimentID, size));
  }

  public async experimentsAsSequenceSource(userGroups: number[]): Promise<Experiment<Output>[]> {
    return this.queryBus.execute(
      new ExperimentsAllQuery(
        userGroups,
        {
          supportSequences: true
        }
      )
    );
  }
}
