import DoneCallback = jest.DoneCallback;
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { queryBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentDoNotSupportSequencesException, InvalidSequenceSizeException, SequenceGeneratorFactory } from '@diplomka-backend/stim-feature-sequences/domain';
import { SequenceGenerateCommand, SequenceWasGeneratedEvent } from '@diplomka-backend/stim-feature-sequences/application';

import { SequenceGenerateHandler } from './sequence-generate.handler';

describe('SequenceGenerateHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceGenerateHandler;
  let factory: MockType<SequenceGeneratorFactory>;
  let queryBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  const generatedSequence = [];

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceGenerateHandler,
        {
          provide: SequenceGeneratorFactory,
          useValue: { createSequenceGenerator: jest.fn(() => ({ name: 'FakeGenerator', generate: () => generatedSequence })) },
        },
        queryBusProvider,
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<SequenceGenerateHandler>(SequenceGenerateHandler);
    // @ts-ignore
    factory = testingModule.get<MockType<SequenceGeneratorFactory>>(SequenceGeneratorFactory);
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
    const userID = 0;
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const command = new SequenceGenerateCommand(experimentID, sequenceSize, userID);

    queryBus.execute.mockReturnValueOnce(experiment);

    const sequence = await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new SequenceWasGeneratedEvent(generatedSequence));
    expect(sequence).toBe(generatedSequence);
  });

  it('negative - should throw exception when experiment does not support sequences', async (done: DoneCallback) => {
    const experimentID = 1;
    const sequenceSize = 10;
    const userID = 0;
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = false;
    const command = new SequenceGenerateCommand(experimentID, sequenceSize, userID);

    queryBus.execute.mockReturnValueOnce(experiment);

    try {
      await handler.execute(command);
      done.fail('ExperimentDoNotSupportSequencesException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentDoNotSupportSequencesException) {
        expect(e.experimentID).toBe(experimentID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when invalid length of sequence was requested', async (done: DoneCallback) => {
    const experimentID = 1;
    const sequenceSize = -5;
    const userID = 0;
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const command = new SequenceGenerateCommand(experimentID, sequenceSize, userID);

    queryBus.execute.mockReturnValueOnce(experiment);

    try {
      await handler.execute(command);
      done.fail('InvalidSequenceSizeException was not thrown!');
    } catch (e) {
      if (e instanceof InvalidSequenceSizeException) {
        expect(e.sequenceSize).toBe(sequenceSize);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
