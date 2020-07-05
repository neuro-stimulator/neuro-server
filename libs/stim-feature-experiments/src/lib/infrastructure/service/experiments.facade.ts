import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FindManyOptions } from 'typeorm';

import { Experiment } from '@stechy1/diplomka-share';
// tslint:disable-next-line:nx-enforce-module-boundaries
// import { SequencesForExperimentQuery } from '@diplomka-backend/stim-feature-sequences';

import { ExperimentsAllQuery } from '../../application/queries/impl/experiments-all.query';
import { ExperimentEntity } from '../../domain/model/entity/experiment.entity';
import { ExperimentsFilteredQuery } from '../../application/queries/impl/experiments-filtered.query';
import { ExperimentByIdQuery } from '../../application/queries/impl/experiment-by-id.query';
import { ExperimentValidateCommand } from '../../application/commands/impl/experiment-validate.command';
import { ExperimentInsertCommand } from '../../application/commands/impl/experiment-insert.command';
import { ExperimentUpdateCommand } from '../../application/commands/impl/experiment-update.command';
import { ExperimentDeleteCommand } from '../../application/commands/impl/experiment-delete.command';
import { ExperimentMultimediaQuery } from '../../application/queries/impl/experiment-multimedia.query';
import { ExperimentNameExistsQuery } from '../../application/queries/impl/experiment-name-exists.query';

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
    return [];
    // return this.queryBus.execute(new SequencesForExperimentQuery(experimentID));
  }
}
