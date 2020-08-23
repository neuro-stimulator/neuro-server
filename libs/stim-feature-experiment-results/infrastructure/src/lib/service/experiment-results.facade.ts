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

  public async experimentResultsAll(userID: number): Promise<ExperimentResult[]> {
    return this.queryBus.execute(new ExperimentResultsAllQuery(userID));
  }

  public async validate(experimentResult: ExperimentResult): Promise<boolean> {
    return this.commandBus.execute(new ExperimentResultValidateCommand(experimentResult));
  }

  public async experimentResultByID(experimentResultID: number, userID: number): Promise<ExperimentResult> {
    return this.queryBus.execute(new ExperimentResultByIdQuery(experimentResultID, userID));
  }

  public async resultData(experimentResultID: number, userID: number): Promise<ReadStream | string> {
    return this.queryBus.execute(new ExperimentResultDataQuery(experimentResultID, userID));
  }

  public async update(experimentResult: ExperimentResult, userID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentResultUpdateCommand(experimentResult, userID));
  }

  public async delete(experimentResultID: number, userID: number): Promise<void> {
    return this.commandBus.execute(new ExperimentResultDeleteCommand(experimentResultID, userID));
  }

  public async nameExists(name: string, experimentResultID: number): Promise<boolean> {
    return this.queryBus.execute(new ExperimentResultNameExistsQuery(name, experimentResultID));
  }
}
