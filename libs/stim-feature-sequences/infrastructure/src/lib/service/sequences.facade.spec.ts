import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { createEmptySequence, ExperimentType, Sequence } from '@stechy1/diplomka-share';

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

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

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
      await facade.sequencesAll();

      expect(queryBusMock.execute).toBeCalledWith(new SequencesAllQuery());
    });
  });

  describe('sequenceById()', () => {
    it('should call ', async () => {
      const sequenceID = 1;

      await facade.sequenceById(sequenceID);

      expect(queryBusMock.execute).toBeCalledWith(new SequenceByIdQuery(sequenceID));
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

      await facade.insert(sequence);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceInsertCommand(sequence));
    });
  });

  describe('update()', () => {
    it('should call ', async () => {
      const sequence: Sequence = createEmptySequence();

      await facade.update(sequence);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceUpdateCommand(sequence));
    });
  });

  describe('delete()', () => {
    it('should call ', async () => {
      const sequenceID = 1;

      await facade.delete(sequenceID);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceDeleteCommand(sequenceID));
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

      await facade.sequencesForExperiment(experimentID);

      expect(queryBusMock.execute).toBeCalledWith(new SequencesForExperimentQuery(experimentID));
    });
  });

  describe('generateSequenceForExperiment()', () => {
    it('should call ', async () => {
      const sequenceID = 1;
      const size = 10;

      await facade.generateSequenceForExperiment(sequenceID, size);

      expect(commandBusMock.execute).toBeCalledWith(new SequenceGenerateCommand(sequenceID, size));
    });
  });

  describe('experimentsAsSequenceSource()', () => {
    it('should call ', async () => {
      await facade.experimentsAsSequenceSource();

      expect(queryBusMock.execute).toBeCalledWith(
        new ExperimentsFilteredQuery({
          where: { type: ExperimentType[ExperimentType.ERP] },
        })
      );
    });
  });
});
