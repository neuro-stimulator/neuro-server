import { QueryFailedError } from 'typeorm';

import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceNotValidException, SequenceWasNotUpdatedException, SequenceIdNotFoundException } from '@neuro-server/stim-feature-sequences/domain';
import { ValidationErrors } from '@neuro-server/stim-lib-common';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SequenceWasUpdatedEvent } from '../../event/impl/sequence-was-updated.event';
import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceUpdateCommand } from '../impl/sequence-update.command';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';

import { SequenceUpdateHandler } from './sequence-update.handler';

describe('SequenceUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceUpdateHandler;
  let service: MockType<SequencesService>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceUpdateHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
        eventBusProvider,
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SequenceUpdateHandler>(SequenceUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.update.mockClear();
    eventBus.publish.mockClear();
    commandBus.execute.mockClear();
  });

  it('positive - should update sequence', async () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const command = new SequenceUpdateCommand(userGroups, sequence);

    commandBus.execute.mockReturnValue(true);
    service.byId.mockReturnValue(sequence);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new SequenceValidateCommand(sequence));
    expect(service.update).toBeCalledWith(userGroups, sequence);
    expect(eventBus.publish).toBeCalledWith(new SequenceWasUpdatedEvent(sequence));
  });

  it('negative - should throw exception when sequence not found', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const command = new SequenceUpdateCommand(userGroups, sequence);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new SequenceIdNotFoundException(sequence.id);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceIdNotFoundException(sequence.id));
  });

  it('negative - should throw exception when sequence is not valid', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const errors: ValidationErrors = [];
    const command = new SequenceUpdateCommand(userGroups, sequence);

    commandBus.execute.mockImplementation(() => {
      throw new SequenceNotValidException(sequence, errors);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceNotValidException(sequence, errors));
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should throw exception when command failed', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const command = new SequenceUpdateCommand(userGroups, sequence);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceWasNotUpdatedException(sequence));
  });

  it('negative - should throw exception when unknown error', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const userGroups = [1];
    const command = new SequenceUpdateCommand(userGroups, sequence);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new SequenceWasNotUpdatedException(sequence));
  });
});
