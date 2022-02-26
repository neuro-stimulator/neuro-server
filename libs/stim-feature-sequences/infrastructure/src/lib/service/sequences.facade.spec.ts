import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsAllQuery } from '@neuro-server/stim-feature-experiments/application';
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
} from '@neuro-server/stim-feature-sequences/application';

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
      const userGroups = [1];

      await facade.sequencesAll(userGroups);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesAllQuery(userGroups));
    });
  });

  describe('sequenceById()', () => {
    it('should call ', async () => {
      const userGroups = [1];
      const sequenceID = 1;

      await facade.sequenceById(userGroups, sequenceID);

      expect(queryBusMock.execute).toBeCalledWith(new SequenceByIdQuery(userGroups, sequenceID));
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

      await facade.insert(userID, sequence);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceInsertCommand(userID, sequence));
    });
  });

  describe('update()', () => {
    it('should call ', async () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();

      await facade.update(userGroups, sequence);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceUpdateCommand(userGroups, sequence));
    });
  });

  describe('delete()', () => {
    it('should call ', async () => {
      const userGroups = [1];
      const sequenceID = 1;

      await facade.delete(userGroups, sequenceID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceDeleteCommand(userGroups, sequenceID));
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
      const userGroups = [1];
      const experimentID = 1;

      await facade.sequencesForExperiment(userGroups, experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesForExperimentQuery(userGroups, experimentID));
    });
  });

  describe('generateSequenceForExperiment()', () => {
    it('should call ', async () => {
      const userGroups = [1];
      const sequenceID = 1;
      const size = 10;

      await facade.generateSequenceForExperiment(userGroups, sequenceID, size);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceGenerateCommand(userGroups, sequenceID, size));
    });
  });

  describe('experimentsAsSequenceSource()', () => {
    it('should call ', async () => {
      const userGroups = [1];

      await facade.experimentsAsSequenceSource(userGroups);

      expect(queryBusMock.execute).toBeCalledWith(
        new ExperimentsAllQuery(
          userGroups,
          {
            supportSequences: true
          },
        )
      );
    });
  });
});
