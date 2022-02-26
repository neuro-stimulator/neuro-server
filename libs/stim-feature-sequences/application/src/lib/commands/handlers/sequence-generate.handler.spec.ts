import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { ExperimentDoNotSupportSequencesException, InvalidSequenceSizeException, SequenceGeneratorFactory } from '@neuro-server/stim-feature-sequences/domain';

import { queryBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SequenceWasGeneratedEvent } from '../../event/impl/sequence-was-generated.event';
import { SequenceGenerateCommand } from '../impl/sequence-generate.command';

import { SequenceGenerateHandler } from './sequence-generate.handler';

describe('SequenceGenerateHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceGenerateHandler;
  let queryBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  const generatedSequence = [];

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceGenerateHandler,
        {
          provide: SequenceGeneratorFactory,
          useValue: { createSequenceGenerator: jest.fn(() => ({ name: 'FakeGenerator', generate: () => generatedSequence })) }
        },
        queryBusProvider,
        eventBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SequenceGenerateHandler>(SequenceGenerateHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should generate new sequence', async () => {
    const experimentID = 1;
    const sequenceSize = 10;
    const userGroups = [1];
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const command = new SequenceGenerateCommand(userGroups, experimentID, sequenceSize);

    queryBus.execute.mockReturnValueOnce(experiment);

    const sequence = await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new SequenceWasGeneratedEvent(generatedSequence));
    expect(sequence).toBe(generatedSequence);
  });

  it('negative - should throw exception when experiment does not support sequences', () => {
    const experimentID = 1;
    const sequenceSize = 10;
    const userGroups = [1];
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = false;
    const command = new SequenceGenerateCommand(userGroups, experimentID, sequenceSize);

    queryBus.execute.mockReturnValueOnce(experiment);

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentDoNotSupportSequencesException(experimentID));
  });

  it('negative - should throw exception when invalid length of sequence was requested', () => {
    const experimentID = 1;
    const sequenceSize = -5;
    const userGroups = [1];
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const command = new SequenceGenerateCommand(userGroups, experimentID, sequenceSize);

    queryBus.execute.mockReturnValueOnce(experiment);

    expect(() => handler.execute(command)).rejects.toThrow(new InvalidSequenceSizeException(sequenceSize));
  });
});
