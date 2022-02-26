import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Experiment, ExperimentAssets, Output, Sequence } from '@stechy1/diplomka-share';

import {
  ExperimentsAllQuery,
  ExperimentByIdQuery,
  ExperimentValidateCommand,
  ExperimentInsertCommand,
  ExperimentUpdateCommand,
  ExperimentDeleteCommand,
  ExperimentMultimediaQuery,
  ExperimentNameExistsQuery,
} from '@neuro-server/stim-feature-experiments/application';
import { IpcSetOutputSynchronizationCommand } from '@neuro-server/stim-feature-ipc/application';
import { SequencesForExperimentQuery, SequenceFromExperimentCommand, SequenceByIdQuery } from '@neuro-server/stim-feature-sequences/application';

@Injectable()
export class ExperimentsFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async experimentsAll(userGroups: number[]): Promise<Experiment<Output>[]> {
    return this.queryBus.execute(new ExperimentsAllQuery(userGroups));
  }

  public async experimentByID(userGroups: number[], experimentID: number): Promise<Experiment<Output>> {
    return this.queryBus.execute(new ExperimentByIdQuery(userGroups, experimentID));
  }

  public async validate(experiment: Experiment<Output>): Promise<boolean> {
    return this.commandBus.execute(new ExperimentValidateCommand(experiment));
  }

  public async insert(experiment: Experiment<Output>, userID: number): Promise<number> {
    return this.commandBus.execute(new ExperimentInsertCommand(experiment, userID));
  }

  public async update(userGroups: number[], experiment: Experiment<Output>): Promise<boolean> {
    return this.commandBus.execute(new ExperimentUpdateCommand(userGroups, experiment));
  }

  public async delete(userGroups: number[], experimentID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentDeleteCommand(userGroups, experimentID));
  }

  public async usedOutputMultimedia(userGroups: number[], experimentID: number): Promise<ExperimentAssets> {
    return this.queryBus.execute(new ExperimentMultimediaQuery(userGroups, experimentID));
  }

  public async nameExists(name: string, experimentID: number | 'new'): Promise<boolean> {
    return this.queryBus.execute(new ExperimentNameExistsQuery(name, experimentID));
  }

  public async sequencesForExperiment(userGroups: number[], experimentID: number): Promise<Sequence[]> {
    return this.queryBus.execute(new SequencesForExperimentQuery(userGroups, experimentID));
  }

  public async sequenceFromExperiment(userID: number, userGroups: number[], id: number, name: string, size: number): Promise<number> {
    return this.commandBus.execute(new SequenceFromExperimentCommand(userID, userGroups, id, name, size));
  }

  public async sequenceById(userGroups: number[], sequenceID: number): Promise<Sequence> {
    return this.queryBus.execute(new SequenceByIdQuery(userGroups, sequenceID));
  }

  public async setOutputSynchronization(synchronize: boolean, userGroups: number[], experimentID?: number): Promise<void> {
    return this.commandBus.execute(new IpcSetOutputSynchronizationCommand(synchronize, userGroups, experimentID, true));
  }
}
