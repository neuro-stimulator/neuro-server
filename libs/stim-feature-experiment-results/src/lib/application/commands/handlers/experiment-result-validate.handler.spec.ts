import { Test, TestingModule } from '@nestjs/testing';
import { Schema, Validator } from 'jsonschema';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { createSchemaValidator, MockType } from 'test-helpers/test-helpers';

import { ExperimentResultNotValidException } from '../../../domain/exception/experiment-result-not-valid.exception';
import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../../domain/services/experiment-results.service.jest';
import { ExperimentResultValidateHandler } from './experiment-result-validate.handler';
import { ExperimentResultValidateCommand } from '../impl/experiment-result-validate.command';

describe('ExperimentResultValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultValidateHandler;
  let service: MockType<ExperimentResultsService>;
  let facade: MockType<FileBrowserFacade>;
  let validator: MockType<Validator>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultValidateHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
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
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultValidateHandler>(ExperimentResultValidateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
    // @ts-ignore
    validator = testingModule.get<MockType<Validator>>(Validator);
  });

  afterEach(() => {
    service.delete.mockClear();
    facade.readPrivateJSONFile.mockClear();
    validator.validate.mockClear();
  });

  it('positive - should validate experiment result', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const schema: Schema = {};
    const command = new ExperimentResultValidateCommand(experimentResult);

    facade.readPrivateJSONFile.mockReturnValue(schema);
    validator.validate.mockReturnValue({ valid: true });

    const result = await handler.execute(command);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when not valid', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const schema: Schema = {};
    const command = new ExperimentResultValidateCommand(experimentResult);

    facade.readPrivateJSONFile.mockReturnValue(schema);
    validator.validate.mockImplementation(() => {
      throw new ExperimentResultNotValidException(experimentResult);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultNotValidException exception was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
