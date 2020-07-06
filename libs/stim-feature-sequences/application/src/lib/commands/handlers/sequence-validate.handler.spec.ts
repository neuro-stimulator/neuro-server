import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import DoneCallback = jest.DoneCallback;
import { Schema, Validator } from 'jsonschema';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';
import { SequenceNotValidException } from '@diplomka-backend/stim-feature-sequences/domain';

import { createSchemaValidator, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { SequencesService } from '../../services/sequences.service';
import { createSequencesServiceMock } from '../../services/sequences.service.jest';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';
import { SequenceValidateHandler } from './sequence-validate.handler';

describe('SequenceValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: SequenceValidateHandler;
  let service: MockType<SequencesService>;
  let eventBus: MockType<EventBus>;
  let facade: MockType<FileBrowserFacade>;
  let validator: MockType<Validator>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceValidateHandler,
        {
          provide: SequencesService,
          useFactory: createSequencesServiceMock,
        },
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({
            readPrivateJSONFile: jest.fn(),
          })),
        },
        {
          provide: Validator,
          useFactory: createSchemaValidator,
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<SequenceValidateHandler>(SequenceValidateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SequencesService>>(SequencesService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
    // @ts-ignore
    validator = testingModule.get<MockType<Validator>>(Validator);
  });

  afterEach(() => {
    service.delete.mockClear();
    eventBus.publish.mockClear();
    facade.readPrivateJSONFile.mockClear();
    validator.validate.mockClear();
  });

  it('positive - should validate sequence', async () => {
    const sequence: Sequence = createEmptySequence();
    const schema: Schema = {};
    const command = new SequenceValidateCommand(sequence);

    facade.readPrivateJSONFile.mockReturnValue(schema);
    validator.validate.mockReturnValue({ valid: true });

    const result = await handler.execute(command);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when not valid', async (done: DoneCallback) => {
    const sequence: Sequence = createEmptySequence();
    const schema: Schema = {};
    const command = new SequenceValidateCommand(sequence);

    facade.readPrivateJSONFile.mockReturnValue(schema);
    validator.validate.mockReturnValue({ valid: false });

    try {
      await handler.execute(command);
      done.fail('SequenceNotValidException exception was thrown');
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        done();
      } else {
        done.fail('Unknown exception was thrown');
      }
    }
  });
});
