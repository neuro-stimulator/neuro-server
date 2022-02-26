import { QueryFailedError } from 'typeorm';

import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceIdNotFoundException, SequenceWasNotDeletedException } from '@neuro-server/stim-feature-sequences/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SequenceWasDeletedEvent } from '../../event/impl/sequence-was-deleted.event';
import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceDeleteCommand } from '../impl/sequence-delete.command';

import { SequenceDeleteHandler } from './sequence-delete.handler';

describe('SequenceDeleteHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceDeleteHandler;
  let service: MockType<SequencesService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceDeleteHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SequenceDeleteHandler>(SequenceDeleteHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.delete.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should delete sequence', async () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const command = new SequenceDeleteCommand(userGroups, sequence.id);

    service.byId.mockReturnValue(sequence);

    await handler.execute(command);

    expect(service.delete).toBeCalledWith(sequence.id);
    expect(eventBus.publish).toBeCalledWith(new SequenceWasDeletedEvent(sequence));
  });

  it('negative - should throw exception when sequence not found', () => {
    const sequenceID = -1;
    const userGroups = [1];
    const command = new SequenceDeleteCommand(userGroups, sequenceID);

    service.byId.mockImplementation(() => {
      throw new SequenceIdNotFoundException(sequenceID);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceIdNotFoundException(sequenceID));
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should throw exception when command failed', () => {
    const sequenceID = -1;
    const userGroups = [1];
    const command = new SequenceDeleteCommand(userGroups, sequenceID);

    service.byId.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceWasNotDeletedException(sequenceID));
  });

  it('negative - should throw exception when unknown error', () => {
    const sequenceID = -1;
    const userGroups = [1];
    const command = new SequenceDeleteCommand(userGroups, sequenceID);

    service.byId.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceWasNotDeletedException(sequenceID));
  });
});
