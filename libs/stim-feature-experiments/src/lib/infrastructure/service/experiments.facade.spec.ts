import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { ExperimentsAllQuery } from '../../application/queries/impl/experiments-all.query';
import { ExperimentByIdQuery } from '../../application/queries/impl/experiment-by-id.query';
import { ExperimentValidateCommand } from '../../application/commands/impl/experiment-validate.command';
import { ExperimentInsertCommand } from '../../application/commands/impl/experiment-insert.command';
import { ExperimentUpdateCommand } from '../../application/commands/impl/experiment-update.command';
import { ExperimentDeleteCommand } from '../../application/commands/impl/experiment-delete.command';
import { ExperimentMultimediaQuery } from '../../application/queries/impl/experiment-multimedia.query';
import { ExperimentNameExistsQuery } from '../../application/queries/impl/experiment-name-exists.query';
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
      await facade.experimentsAll();

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentsAllQuery());
    });
  });

  // describe('filteredExperiments()', () => {
  //   it('positive - should call ', async () => {});
  // });

  describe('experimentByID()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;

      await facade.experimentByID(experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentByIdQuery(experimentID));
    });
  });

  describe('validate()', () => {
    it('positive - should call ', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await facade.validate(experiment);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentValidateCommand(experiment));
    });
  });

  describe('insert()', () => {
    it('positive - should call ', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await facade.insert(experiment);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentInsertCommand(experiment));
    });
  });

  describe('update()', () => {
    it('positive - should call ', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await facade.update(experiment);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentUpdateCommand(experiment));
    });
  });

  describe('delete()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;

      await facade.delete(experimentID);

      expect(commandBusMock.execute).toBeCalledWith(new ExperimentDeleteCommand(experimentID));
    });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;

      await facade.usedOutputMultimedia(experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new ExperimentMultimediaQuery(experimentID));
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
});
