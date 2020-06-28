import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsAllQuery } from '../../application/queries/impl/experiment-results-all.query';
import { ExperimentResultByIdQuery } from '../../application/queries/impl/experiment-result-by-id.query';
import { ExperimentResultValidateCommand } from '../../application/commands/impl/experiment-result-validate.command';
import { ExperimentResultDataQuery } from '../../application/queries/impl/experiment-result-data.query';
import { ExperimentResultUpdateCommand } from '../../application/commands/impl/experiment-result-update.command';
import { ExperimentResultDeleteCommand } from '../../application/commands/impl/experiment-result-delete.command';
import { ExperimentResultNameExistsQuery } from '../../application/queries/impl/experiment-result-name-exists.query';
import { ExperimentResultsFacade } from './experiment-results.facade';

describe('Experiment results facade', () => {
  let testingModule: TestingModule;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;
  let facade: ExperimentResultsFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [ExperimentResultsFacade, commandBusProvider, queryBusProvider],
    }).compile();

    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    facade = testingModule.get<ExperimentResultsFacade>(ExperimentResultsFacade);
  });

  afterEach(() => {
    commandBusMock.execute.mockClear();
    queryBusMock.execute.mockClear();
  });

  describe('experimentResultsAll()', () => {
    it('positive - should call ', async () => {
      await facade.experimentResultsAll();

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultsAllQuery());
    });
  });

  describe('experimentResultByID()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;

      await facade.experimentResultByID(experimentResultID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultByIdQuery(experimentResultID));
    });
  });

  describe('validate()', () => {
    it('positive - should call ', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());

      await facade.validate(experimentResult);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultValidateCommand(experimentResult));
    });
  });

  describe('resultData()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;

      await facade.resultData(experimentResultID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultDataQuery(experimentResultID));
    });
  });

  describe('update()', () => {
    it('positive - should call ', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());

      await facade.update(experimentResult);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultUpdateCommand(experimentResult));
    });
  });

  describe('delete()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;

      await facade.delete(experimentResultID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultDeleteCommand(experimentResultID));
    });
  });

  describe('nameExists()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;
      const name = 'test';

      await facade.nameExists(name, experimentResultID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultNameExistsQuery(name, experimentResultID));
    });
  });
});
