import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FindManyOptions } from 'typeorm';

import { Experiment, ExperimentAssets, Output } from '@stechy1/diplomka-share';

import { SequencesForExperimentQuery, SequenceFromExperimentCommand, SequenceByIdQuery } from '@diplomka-backend/stim-feature-sequences/application';

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
import { IpcSetOutputSynchronizationCommand } from '@diplomka-backend/stim-feature-ipc/application';

@Injectable()
export class ExperimentsFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async experimentsAll(userID: number): Promise<Experiment<Output>[]> {
    return this.queryBus.execute(new ExperimentsAllQuery(userID));
  }

  public async filteredExperiments(filter: FindManyOptions<ExperimentEntity>, userID: number): Promise<Experiment<Output>[]> {
    return this.queryBus.execute(new ExperimentsFilteredQuery(filter, userID));
  }

  public async experimentByID(experimentID: number, userID: number): Promise<Experiment<Output>> {
    return this.queryBus.execute(new ExperimentByIdQuery(experimentID, userID));
  }

  public async validate(experiment: Experiment<Output>): Promise<boolean> {
    return this.commandBus.execute(new ExperimentValidateCommand(experiment));
  }

  public async insert(experiment: Experiment<Output>, userID: number): Promise<number> {
    return this.commandBus.execute(new ExperimentInsertCommand(experiment, userID));
  }

  public async update(experiment: Experiment<Output>, userID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentUpdateCommand(experiment, userID));
  }

  public async delete(experimentID: number, userID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentDeleteCommand(experimentID, userID));
  }

  public async usedOutputMultimedia(experimentID: number, userID: number): Promise<ExperimentAssets> {
    return this.queryBus.execute(new ExperimentMultimediaQuery(experimentID, userID));
  }

  public async nameExists(name: string, experimentID: number | 'new'): Promise<boolean> {
    return this.queryBus.execute(new ExperimentNameExistsQuery(name, experimentID));
  }

  public async sequencesForExperiment(experimentID: number, userID: number) {
    return this.queryBus.execute(new SequencesForExperimentQuery(experimentID, userID));
  }

  public async sequenceFromExperiment(id: number, name: string, size: number, userID: number): Promise<number> {
    return this.commandBus.execute(new SequenceFromExperimentCommand(id, name, size, userID));
  }

  public async sequenceById(sequenceID: number, userID: number) {
    return this.queryBus.execute(new SequenceByIdQuery(sequenceID, userID));
  }

  public async setOutputSynchronization(synchronize: boolean, userID: number, experimentID?: number): Promise<void> {
    return await this.commandBus.execute(new IpcSetOutputSynchronizationCommand(synchronize, userID, experimentID, true));
  }
}
