import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FindManyOptions } from 'typeorm';

import { Experiment } from '@stechy1/diplomka-share';

import { SequencesForExperimentQuery } from '@diplomka-backend/stim-feature-sequences/application';

import { ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import {
  ExperimentsAllQuery,
  ExperimentsFilteredQuery,
  ExperimentByIdQuery,
  ExperimentValidateCommand,
  ExperimentInsertCommand,
  ExperimentUpdateCommand,
  ExperimentDeleteCommand,
  ExperimentMultimediaQuery,
  ExperimentNameExistsQuery,
} from '@diplomka-backend/stim-feature-experiments/application';

@Injectable()
export class ExperimentsFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async experimentsAll(): Promise<Experiment[]> {
    return this.queryBus.execute(new ExperimentsAllQuery());
  }

  public async filteredExperiments(filter: FindManyOptions<ExperimentEntity>): Promise<Experiment[]> {
    return this.queryBus.execute(new ExperimentsFilteredQuery(filter));
  }

  public async experimentByID(experimentID: number): Promise<Experiment> {
    return this.queryBus.execute(new ExperimentByIdQuery(experimentID));
  }

  public async validate(experiment: Experiment): Promise<boolean> {
    return this.commandBus.execute(new ExperimentValidateCommand(experiment));
  }

  public async insert(experiment: Experiment): Promise<number> {
    return this.commandBus.execute(new ExperimentInsertCommand(experiment));
  }

  public async update(experiment: Experiment): Promise<void> {
    return this.commandBus.execute(new ExperimentUpdateCommand(experiment));
  }

  public async delete(experimentID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentDeleteCommand(experimentID));
  }

  public async usedOutputMultimedia(experimentID: number): Promise<{ audio: {}; image: {} }> {
    return this.queryBus.execute(new ExperimentMultimediaQuery(experimentID));
  }

  public async nameExists(name: string, experimentID: number | 'new'): Promise<boolean> {
    return this.queryBus.execute(new ExperimentNameExistsQuery(name, experimentID));
  }

  public async sequencesForExperiment(experimentID: number) {
    return this.queryBus.execute(new SequencesForExperimentQuery(experimentID));
  }
}
