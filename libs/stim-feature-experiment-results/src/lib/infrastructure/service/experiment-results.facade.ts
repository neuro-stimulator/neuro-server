import { ReadStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsAllQuery } from '../../application/queries/impl/experiment-results-all.query';
import { ExperimentResultValidateCommand } from '../../application/commands/impl/experiment-result-validate.command';
import { ExperimentResultByIdQuery } from '../../application/queries/impl/experiment-result-by-id.query';
import { ExperimentResultDataQuery } from '../../application/queries/impl/experiment-result-data.query';
import { ExperimentResultUpdateCommand } from '../../application/commands/impl/experiment-result-update.command';
import { ExperimentResultDeleteCommand } from '../../application/commands/impl/experiment-result-delete.command';
import { ExperimentResultNameExistsQuery } from '../../application/queries/impl/experiment-result-name-exists.query';

@Injectable()
export class ExperimentResultsFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  public async experimentResultsAll(): Promise<ExperimentResult[]> {
    return this.queryBus.execute(new ExperimentResultsAllQuery());
  }

  public async validate(experimentResult: ExperimentResult): Promise<boolean> {
    return this.commandBus.execute(
      new ExperimentResultValidateCommand(experimentResult)
    );
  }

  public async experimentResultByID(
    experimentResultID: number
  ): Promise<ExperimentResult> {
    return this.queryBus.execute(
      new ExperimentResultByIdQuery(experimentResultID)
    );
  }

  public async resultData(
    experimentResultID: number
  ): Promise<ReadStream | string> {
    return this.queryBus.execute(
      new ExperimentResultDataQuery(experimentResultID)
    );
  }

  public async update(experimentResult: ExperimentResult): Promise<void> {
    return this.commandBus.execute(
      new ExperimentResultUpdateCommand(experimentResult)
    );
  }

  public async delete(experimentResultID: number): Promise<void> {
    return this.commandBus.execute(
      new ExperimentResultDeleteCommand(experimentResultID)
    );
  }

  public async nameExists(
    name: string,
    experimentResultID: number
  ): Promise<boolean> {
    return this.queryBus.execute(
      new ExperimentResultNameExistsQuery(name, experimentResultID)
    );
  }
}
