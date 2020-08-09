import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MessageCodes } from '@stechy1/diplomka-share';

import { NoUploadedExperimentException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { MockType } from 'test-helpers/test-helpers';

import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { StimulatorService } from '../../service/stimulator.service';
import { GetCurrentExperimentIdQuery } from '../impl/get-current-experiment-id.query';
import { GetCurrentExperimentIdHandler } from './get-current-experiment-id.handler';

describe('GetCurrentExperimentIdHandler', () => {
  let testingModule: TestingModule;
  let handler: GetCurrentExperimentIdHandler;
  let service: MockType<StimulatorService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetCurrentExperimentIdHandler,
        {
          provide: StimulatorService,
          useFactory: createStimulatorServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<GetCurrentExperimentIdHandler>(GetCurrentExperimentIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
  });

  it('positive - should get currentExperimentID', async () => {
    const experimentID = 1;
    const query = new GetCurrentExperimentIdQuery();

    Object.defineProperty(service, 'currentExperimentID', {
      get: jest.fn(() => experimentID),
    });

    const result = await handler.execute(query);

    expect(result).toEqual(experimentID);
  });

  it('negative - shoudl throw exception when no experiment', async (done: DoneCallback) => {
    const query = new GetCurrentExperimentIdQuery();

    Object.defineProperty(service, 'currentExperimentID', {
      get: jest.fn(() => StimulatorService.NO_EXPERIMENT_ID),
    });

    try {
      await handler.execute(query);
      done.fail('NoUploadedExperimentException was not thrown!');
    } catch (e) {
      if (e instanceof NoUploadedExperimentException) {
        expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_STIMULATOR_NO_UPLOADED_EXPERIMENT);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
