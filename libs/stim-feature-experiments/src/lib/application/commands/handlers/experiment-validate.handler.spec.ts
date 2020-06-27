import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { Schema, Validator } from 'jsonschema';

import { createSchemaValidator, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { createExperimentsServiceMock } from '../../../domain/services/experiments.service.jest';
import { ExperimentValidateCommand } from '../impl/experiment-validate.command';
import { ExperimentValidateHandler } from './experiment-validate.handler';
import DoneCallback = jest.DoneCallback;
import { ExperimentNotValidException } from '@diplomka-backend/stim-feature-experiments';

describe('ExperimentValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentValidateHandler;
  let service: MockType<ExperimentsService>;
  let eventBus: MockType<EventBus>;
  let facade: MockType<FileBrowserFacade>;
  let validator: MockType<Validator>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentValidateHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
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

    handler = testingModule.get<ExperimentValidateHandler>(ExperimentValidateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
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

  it('positive - should validate experiment', async () => {
    const experiment: Experiment = createEmptyExperiment();
    const schema: Schema = {};
    const command = new ExperimentValidateCommand(experiment);

    facade.readPrivateJSONFile.mockReturnValue(schema);
    validator.validate.mockReturnValue({ valid: true });

    const result = await handler.execute(command);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when not valid', async (done: DoneCallback) => {
    const experiment: Experiment = createEmptyExperiment();
    const schema: Schema = {};
    const command = new ExperimentValidateCommand(experiment);

    facade.readPrivateJSONFile.mockReturnValue(schema);
    validator.validate.mockReturnValue({ valid: false });

    try {
      await handler.execute(command);
      done.fail('ExperimentNotValidException exception was thrown');
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        done();
      } else {
        done.fail('Unknown exception was thrown');
      }
    }
  });
});
