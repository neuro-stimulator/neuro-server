import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { SequenceNotValidException, SequenceWasNotCreatedException } from '@diplomka-backend/stim-feature-sequences/domain';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceWasCreatedEvent } from '../../event/impl/sequence-was-created.event';
import { SequenceInsertCommand } from '../impl/sequence-insert.command';
import { SequenceInsertHandler } from './sequence-insert.handler';

describe('SequenceInsertHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceInsertHandler;
  let service: MockType<SequencesService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceInsertHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SequenceInsertHandler>(SequenceInsertHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.insert.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should insert sequence', async () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userID = 0;
    const command = new SequenceInsertCommand(userID, sequence);

    service.insert.mockReturnValue(sequence.id);

    const result = await handler.execute(command);

    expect(result).toEqual(sequence.id);
    expect(service.insert).toBeCalledWith(sequence, userID);
    expect(eventBus.publish).toBeCalledWith(new SequenceWasCreatedEvent(sequence.id));
  });

  it('negative - should throw exception when sequence not found', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userID = 0;
    const command = new SequenceInsertCommand(userID, sequence);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceWasNotCreatedException(sequence));
  });

  it('negative - should throw exception when sequence not found', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userID = 0;
    const errors: ValidationErrors = [];
    const command = new SequenceInsertCommand(userID, sequence);

    service.insert.mockImplementation(() => {
      throw new SequenceNotValidException(sequence, errors);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceNotValidException(sequence, []));
  });

  it('negative - should throw exception when unknown error', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userID = 0;
    const command = new SequenceInsertCommand(userID, sequence);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceWasNotCreatedException(sequence));
  });
});
