import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { SequenceByIdQuery, SequenceFromExperimentCommand, SequencesForExperimentQuery } from '@diplomka-backend/stim-feature-sequences/application';

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import {
  ExperimentsAllQuery,
  ExperimentByIdQuery,
  ExperimentValidateCommand,
  ExperimentInsertCommand,
  ExperimentUpdateCommand,
  ExperimentDeleteCommand,
  ExperimentMultimediaQuery,
  ExperimentNameExistsQuery,
  ExperimentsFilteredQuery,
} from '@diplomka-backend/stim-feature-experiments/application';

import { ExperimentsFacade } from './experiments.facade';
import { FindManyOptions } from 'typeorm';
import { ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { IpcSetOutputSynchronizationCommand } from '@diplomka-backend/stim-feature-ipc/application';

describe('Experiments facade', () => {
  let testingModule: TestingModule;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;
  let facade: ExperimentsFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [ExperimentsFacade, commandBusProvider, queryBusProvider],
    }).compile();

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
      const userID = 0;

      await facade.experimentsAll(userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentsAllQuery(userID));
    });
  });

  describe('filteredExperiments()', () => {
    it('positive - should call ', async () => {
      const filter: FindManyOptions<ExperimentEntity> = {};
      const userID = 0;

      await facade.filteredExperiments(filter, userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentsFilteredQuery(filter, userID));
    });
  });

  describe('experimentByID()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userID = 0;

      await facade.experimentByID(experimentID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentByIdQuery(experimentID, userID));
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
      const userID = 0;

      await facade.update(experiment, userID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentUpdateCommand(experiment, userID));
    });
  });

  describe('delete()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userID = 0;

      await facade.delete(experimentID, userID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentDeleteCommand(experimentID, userID));
    });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const userID = 0;

      await facade.usedOutputMultimedia(experimentID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentMultimediaQuery(experimentID, userID));
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
      const userID = 0;

      await facade.sequencesForExperiment(experimentID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesForExperimentQuery(experimentID, userID));
    });
  });

  describe('sequenceFromExperiment()', () => {
    it('positive - should call ', async () => {
      const id = 1;
      const name = 'name';
      const size = 10;
      const userID = 0;

      await facade.sequenceFromExperiment(id, name, size, userID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceFromExperimentCommand(id, name, size, userID));
    });
  });

  describe('sequenceById()', () => {
    it('positive - should call ', async () => {
      const sequenceID = 1;
      const userID = 0;

      await facade.sequenceById(sequenceID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new SequenceByIdQuery(sequenceID, userID));
    });
  });

  it('positive - should call setOutputSynchronization()', async () => {
    const synchronize = false;
    const userID = 1;
    const experimentID = 1;

    await facade.setOutputSynchronization(synchronize, userID, experimentID);

    expect(commandBusMock.execute).toBeCalledWith(new IpcSetOutputSynchronizationCommand(synchronize, userID, experimentID, true));
  });
});
