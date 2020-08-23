import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ExperimentType, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsFilteredQuery } from '@diplomka-backend/stim-feature-experiments/application';
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

  public async sequencesAll(userID: number): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesAllQuery(userID));
  }

  public async sequenceById(sequenceID: number, userID: number): Promise<Sequence> {
    return this.queryBus.execute(new SequenceByIdQuery(sequenceID, userID));
  }

  public async validate(sequence: Sequence): Promise<boolean> {
    return this.commandBus.execute(new SequenceValidateCommand(sequence));
  }

  public async insert(sequence: Sequence, userID: number): Promise<number> {
    return this.commandBus.execute(new SequenceInsertCommand(sequence, userID));
  }

  public async update(sequence: Sequence, userID: number): Promise<void> {
    return this.commandBus.execute(new SequenceUpdateCommand(sequence, userID));
  }

  public async delete(sequenceID: number, userID: number): Promise<void> {
    return this.commandBus.execute(new SequenceDeleteCommand(sequenceID, userID));
  }

  public async nameExists(name: string, sequenceID: number | 'new'): Promise<boolean> {
    return this.queryBus.execute(new SequenceNameExistsQuery(name, sequenceID));
  }

  public async sequencesForExperiment(experimentID: number, userID: number): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesForExperimentQuery(experimentID, userID));
  }

  public async generateSequenceForExperiment(experimentID: number, size: number, userID: number): Promise<number[]> {
    return this.commandBus.execute(new SequenceGenerateCommand(experimentID, size, userID));
  }

  public async experimentsAsSequenceSource(userID: number) {
    return this.queryBus.execute(
      new ExperimentsFilteredQuery(
        {
          where: { type: ExperimentType[ExperimentType.ERP] },
        },
        userID
      )
    );
  }
}
