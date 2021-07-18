import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsFilteredQuery } from '@diplomka-backend/stim-feature-experiments/application';
import {
  SequencesAllQuery,
  SequenceByIdQuery,
  SequenceValidateCommand,
  SequenceInsertCommand,
  SequenceUpdateCommand,
  SequenceDeleteCommand,
  SequenceNameExistsQuery,
  SequencesForExperimentQuery,
  SequenceGenerateCommand,
} from '@diplomka-backend/stim-feature-sequences/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { SequencesFacade } from './sequences.facade';

describe('Sequences facade', () => {
  let testingModule: TestingModule;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;
  let facade: SequencesFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [SequencesFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    facade = testingModule.get<SequencesFacade>(SequencesFacade);
  });

  afterEach(() => {
    commandBusMock.execute.mockClear();
    queryBusMock.execute.mockClear();
  });

  describe('sequencesAll()', () => {
    it('should call ', async () => {
      const userID = 0;

      await facade.sequencesAll(userID);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesAllQuery(userID));
    });
  });

  describe('sequenceById()', () => {
    it('should call ', async () => {
      const sequenceID = 1;
      const userID = 0;

      await facade.sequenceById(sequenceID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new SequenceByIdQuery(sequenceID, userID));
    });
  });

  describe('validate()', () => {
    it('should call ', async () => {
      const sequence: Sequence = createEmptySequence();

      await facade.validate(sequence);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceValidateCommand(sequence));
    });
  });

  describe('insert()', () => {
    it('should call ', async () => {
      const sequence: Sequence = createEmptySequence();
      const userID = 0;

      await facade.insert(sequence, userID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceInsertCommand(sequence, userID));
    });
  });

  describe('update()', () => {
    it('should call ', async () => {
      const sequence: Sequence = createEmptySequence();
      const userID = 0;

      await facade.update(sequence, userID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceUpdateCommand(sequence, userID));
    });
  });

  describe('delete()', () => {
    it('should call ', async () => {
      const sequenceID = 1;
      const userID = 0;

      await facade.delete(sequenceID, userID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceDeleteCommand(sequenceID, userID));
    });
  });

  describe('nameExists()', () => {
    it('should call ', async () => {
      const sequenceID = 1;
      const name = 'test';

      await facade.nameExists(name, sequenceID);

      expect(queryBusMock.execute).toBeCalledWith(new SequenceNameExistsQuery(name, sequenceID));
    });
  });

  describe('sequencesForExperiment()', () => {
    it('should call ', async () => {
      const experimentID = 1;
      const userID = 0;

      await facade.sequencesForExperiment(experimentID, userID);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesForExperimentQuery(experimentID, userID));
    });
  });

  describe('generateSequenceForExperiment()', () => {
    it('should call ', async () => {
      const sequenceID = 1;
      const size = 10;
      const userID = 0;

      await facade.generateSequenceForExperiment(sequenceID, size, userID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceGenerateCommand(sequenceID, size, userID));
    });
  });

  describe('experimentsAsSequenceSource()', () => {
    it('should call ', async () => {
      const userID = 0;

      await facade.experimentsAsSequenceSource(userID);

      expect(queryBusMock.execute).toBeCalledWith(
        new ExperimentsFilteredQuery(
          {
            where: { supportSequences: true },
          },
          userID
        )
      );
    });
  });
});
