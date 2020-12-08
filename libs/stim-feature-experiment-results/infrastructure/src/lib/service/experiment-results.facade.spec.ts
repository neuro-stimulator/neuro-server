import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';
import {
  ExperimentResultsAllQuery,
  ExperimentResultByIdQuery,
  ExperimentResultValidateCommand,
  ExperimentResultDataQuery,
  ExperimentResultUpdateCommand,
  ExperimentResultDeleteCommand,
  ExperimentResultNameExistsQuery,
} from '@diplomka-backend/stim-feature-experiment-results/application';

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
    testingModule.useLogger(new NoOpLogger());

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
      const userID = 0;

      await facade.experimentResultsAll(userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultsAllQuery(userID));
    });
  });

  describe('experimentResultByID()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;
      const userID = 0;

      await facade.experimentResultByID(experimentResultID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultByIdQuery(experimentResultID, userID));
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
      const userID = 0;

      await facade.resultData(experimentResultID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultDataQuery(experimentResultID, userID));
    });
  });

  describe('update()', () => {
    it('positive - should call ', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
      const userID = 0;

      await facade.update(experimentResult, userID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultUpdateCommand(experimentResult, userID));
    });
  });

  describe('delete()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;
      const userID = 0;

      await facade.delete(experimentResultID, userID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultDeleteCommand(experimentResultID, userID));
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
