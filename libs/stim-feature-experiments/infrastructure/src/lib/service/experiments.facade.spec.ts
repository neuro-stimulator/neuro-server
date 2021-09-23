import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { SequenceByIdQuery, SequenceFromExperimentCommand, SequencesForExperimentQuery } from '@diplomka-backend/stim-feature-sequences/application';
import {
  ExperimentsAllQuery,
  ExperimentByIdQuery,
  ExperimentValidateCommand,
  ExperimentInsertCommand,
  ExperimentUpdateCommand,
  ExperimentDeleteCommand,
  ExperimentMultimediaQuery,
  ExperimentNameExistsQuery,
} from '@diplomka-backend/stim-feature-experiments/application';
import { IpcSetOutputSynchronizationCommand } from '@diplomka-backend/stim-feature-ipc/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { ExperimentsFacade } from './experiments.facade';

describe('Experiments facade', () => {
  let testingModule: TestingModule;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;
  let facade: ExperimentsFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [ExperimentsFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    facade = testingModule.get<ExperimentsFacade>(ExperimentsFacade);
  });

  afterEach(() => {
    commandBusMock.execute.mockClear();
    queryBusMock.execute.mockClear();
  });

  describe('experimentsAll()', () => {
    it('positive - should call query ExperimentsAllQuery', async () => {
      const userGroups = [1];

      await facade.experimentsAll(userGroups);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentsAllQuery(userGroups));
    });
  });

  describe('experimentByID()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userGroups = [1];

      await facade.experimentByID(userGroups, experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentByIdQuery(userGroups, experimentID));
    });
  });

  describe('validate()', () => {
    it('positive - should call ', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();

      await facade.validate(experiment);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentValidateCommand(experiment));
    });
  });

  describe('insert()', () => {
    it('positive - should call ', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      await facade.insert(experiment, userID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentInsertCommand(experiment, userID));
    });
  });

  describe('update()', () => {
    it('positive - should call ', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userGroups = [1];

      await facade.update(userGroups, experiment);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentUpdateCommand(userGroups, experiment));
    });
  });

  describe('delete()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userGroups = [1];

      await facade.delete(userGroups, experimentID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentDeleteCommand(userGroups, experimentID));
    });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userGroups = [1];

      await facade.usedOutputMultimedia(userGroups, experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentMultimediaQuery(userGroups, experimentID));
    });
  });

  describe('nameExists()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const name = 'test';

      await facade.nameExists(name, experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentNameExistsQuery(name, experimentID));
    });
  });

  describe('sequencesForExperiment()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userGroups = [1];

      await facade.sequencesForExperiment(userGroups, experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesForExperimentQuery(userGroups, experimentID));
    });
  });

  describe('sequenceFromExperiment()', () => {
    it('positive - should call ', async () => {
      const id = 1;
      const name = 'name';
      const size = 10;
      const userID = 1;
      const userGroups = [1];

      await facade.sequenceFromExperiment(userID, userGroups, id, name, size);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceFromExperimentCommand(userID, userGroups, id, name, size));
    });
  });

  describe('sequenceById()', () => {
    it('positive - should call ', async () => {
      const sequenceID = 1;
      const userGroups = [1];

      await facade.sequenceById(userGroups, sequenceID);

      expect(queryBusMock.execute).toBeCalledWith(new SequenceByIdQuery(userGroups, sequenceID));
    });
  });

  it('positive - should call setOutputSynchronization()', async () => {
    const synchronize = false;
    const userGroups = [1];
    const experimentID = 1;

    await facade.setOutputSynchronization(synchronize, userGroups, experimentID);

    expect(commandBusMock.execute).toBeCalledWith(new IpcSetOutputSynchronizationCommand(synchronize, userGroups, experimentID, true));
  });
});
