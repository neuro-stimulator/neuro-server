import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

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

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

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
      const userGroups = [1];

      await facade.experimentResultsAll(userGroups);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultsAllQuery(userGroups));
    });
  });

  describe('experimentResultByID()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;
      const userGroups = [1];

      await facade.experimentResultByID(userGroups, experimentResultID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultByIdQuery(userGroups, experimentResultID));
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
      const userGroups = [1];

      await facade.resultData(userGroups, experimentResultID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentResultDataQuery(userGroups, experimentResultID));
    });
  });

  describe('update()', () => {
    it('positive - should call ', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
      const userGroups = [1];

      await facade.update(userGroups, experimentResult);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultUpdateCommand(userGroups, experimentResult));
    });
  });

  describe('delete()', () => {
    it('positive - should call ', async () => {
      const experimentResultID = 1;
      const userGroups = [1];

      await facade.delete(userGroups, experimentResultID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentResultDeleteCommand(userGroups, experimentResultID));
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
