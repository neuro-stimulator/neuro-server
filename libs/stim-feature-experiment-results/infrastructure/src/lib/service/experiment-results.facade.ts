import { ReadStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';
import {
  ExperimentResultsAllQuery,
  ExperimentResultByIdQuery,
  ExperimentResultValidateCommand,
  ExperimentResultDataQuery,
  ExperimentResultUpdateCommand,
  ExperimentResultDeleteCommand,
  ExperimentResultNameExistsQuery,
} from '@diplomka-backend/stim-feature-experiment-results/application';

@Injectable()
export class ExperimentResultsFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async experimentResultsAll(userGroups: number[]): Promise<ExperimentResult[]> {
    return this.queryBus.execute(new ExperimentResultsAllQuery(userGroups));
  }

  public async validate(experimentResult: ExperimentResult): Promise<boolean> {
    return this.commandBus.execute(new ExperimentResultValidateCommand(experimentResult));
  }

  public async experimentResultByID(userGroups: number[], experimentResultID: number): Promise<ExperimentResult> {
    return this.queryBus.execute(new ExperimentResultByIdQuery(userGroups, experimentResultID));
  }

  public async resultData(userGroups: number[], experimentResultID: number): Promise<ReadStream | string> {
    return this.queryBus.execute(new ExperimentResultDataQuery(userGroups, experimentResultID));
  }

  public async update(userGroups: number[], experimentResult: ExperimentResult): Promise<boolean> {
    return this.commandBus.execute(new ExperimentResultUpdateCommand(userGroups, experimentResult));
  }

  public async delete(userGroups: number[], experimentResultID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentResultDeleteCommand(userGroups, experimentResultID));
  }

  public async nameExists(name: string, experimentResultID: number): Promise<boolean> {
    return this.queryBus.execute(new ExperimentResultNameExistsQuery(name, experimentResultID));
  }
}
