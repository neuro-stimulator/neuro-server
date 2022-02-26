import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { LastKnowStimulatorStateQuery } from '../impl/last-know-stimulator-state.query';

import { LastKnowStimulatorStateHandler } from './last-know-stimulator-state.handler';

describe('LastKnowStimulatorStateHandler', () => {
  let testingModule: TestingModule;
  let handler: LastKnowStimulatorStateHandler;
  let service: MockType<StimulatorService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        LastKnowStimulatorStateHandler,
        {
          provide: StimulatorService,
          useFactory: createStimulatorServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<LastKnowStimulatorStateHandler>(LastKnowStimulatorStateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
  });

  it('positive - should retrieve last stimulator state from service', async () => {
    const lastKnownStimulatorState = 0;
    const query = new LastKnowStimulatorStateQuery();

    Object.defineProperty(service, 'lastKnownStimulatorState', {
      get: jest.fn(() => lastKnownStimulatorState),
    });

    const result = await handler.execute(query);

    expect(result).toBe(lastKnownStimulatorState);
  });
});
