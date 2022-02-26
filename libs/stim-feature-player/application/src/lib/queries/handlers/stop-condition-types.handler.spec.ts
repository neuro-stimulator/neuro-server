import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentStopConditionType, ExperimentType } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StopConditionsService } from '../../service/stop-conditions.service';
import { createStopConditionsServiceMock } from '../../service/stop-conditions.service.jest';
import { StopConditionTypesQuery } from '../impl/stop-condition-types.query';

import { StopConditionTypesHandler } from './stop-condition-types.handler';

describe('StopConditionTypesHandler', () => {
  let testingModule: TestingModule;
  let handler: StopConditionTypesHandler;
  let service: MockType<StopConditionsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StopConditionTypesHandler,
        {
          provide: StopConditionsService,
          useFactory: createStopConditionsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<StopConditionTypesHandler>(StopConditionTypesHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StopConditionsService>>(StopConditionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should return stop conditions for defined experiment type', async () => {
    const experimentType: ExperimentType = ExperimentType.NONE;
    const stopConditions: ExperimentStopConditionType[] = [ExperimentStopConditionType.NO_STOP_CONDITION];
    const query = new StopConditionTypesQuery(experimentType);

    service.stopConditionsForExperimentType.mockReturnValueOnce(stopConditions);

    const stopConditionTypes = await handler.execute(query);

    expect(stopConditionTypes).toBe(stopConditions);
  });
});
