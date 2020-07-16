import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';
import { SequenceIdNotFoundError } from '@diplomka-backend/stim-feature-sequences/domain';
import { SequenceNotValidException } from '@diplomka-backend/stim-feature-sequences/domain';
import { SequenceWasNotUpdatedError } from '@diplomka-backend/stim-feature-sequences/domain';

import { commandBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceWasUpdatedEvent } from '../../event/impl/sequence-was-updated.event';
import { SequenceUpdateCommand } from '../impl/sequence-update.command';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';
import { SequenceUpdateHandler } from './sequence-update.handler';
import { ValidationErrors } from '@diplomka-backend/stim-lib-common';

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
    const command = new SequenceUpdateCommand(sequence);

    commandBus.execute.mockReturnValue(true);
    service.byId.mockReturnValue(sequence);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new SequenceValidateCommand(sequence));
    expect(service.update).toBeCalledWith(sequence);
    expect(eventBus.publish).toBeCalledWith(new SequenceWasUpdatedEvent(sequence));
  });

  it('negative - should throw exception when sequence not found', async (done: DoneCallback) => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const command = new SequenceUpdateCommand(sequence);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new SequenceIdNotFoundError(sequence.id);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'SequenceIdNotFoundError was not thrown' });
    } catch (e) {
      if (e instanceof SequenceIdNotFoundError) {
        expect(e.sequenceID).toEqual(sequence.id);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when sequence is not valid', async (done: DoneCallback) => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const errors: ValidationErrors = [];
    const command = new SequenceUpdateCommand(sequence);

    commandBus.execute.mockImplementation(() => {
      throw new SequenceNotValidException(sequence, errors);
    });

    try {
      await handler.execute(command);
      done.fail('SequenceNotValidException was not thrown!');
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        expect(e.sequence).toEqual(sequence);
        expect(e.errors).toEqual(errors);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const command = new SequenceUpdateCommand(sequence);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    try {
      await handler.execute(command);
      done.fail('SequenceResultWasNotUpdatedError was not thrown!');
    } catch (e) {
      if (e instanceof SequenceWasNotUpdatedError) {
        expect(e.sequence).toEqual(sequence);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const sequence: Sequence = createEmptySequence();
    sequence.id = 1;
    const command = new SequenceUpdateCommand(sequence);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('SequenceResultWasNotUpdatedError was not thrown!');
    } catch (e) {
      if (e instanceof SequenceWasNotUpdatedError) {
        expect(e.sequence).toEqual(sequence);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
