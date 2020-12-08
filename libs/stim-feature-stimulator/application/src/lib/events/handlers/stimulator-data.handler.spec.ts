import { Test, TestingModule } from '@nestjs/testing';
import { EventBus, QueryBus } from '@nestjs/cqrs';

import { UnsupportedStimulatorCommandException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorEvent } from '../impl/stimulator.event';
import { StimulatorDataEvent } from '../impl/stimulator-data.event';
import { StimulatorDataHandler } from './stimulator-data.handler';

describe('StimulatorDataHandler', () => {
  let testingModule: TestingModule;
  let handler: StimulatorDataHandler;
  let queryBusMock: MockType<QueryBus>;
  let eventBusMock: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [StimulatorDataHandler, queryBusProvider, eventBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<StimulatorDataHandler>(StimulatorDataHandler);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should create new StimulatorEvent with commandID and event data', async () => {
    const commandID = 0;
    // @ts-ignore
    const data: StimulatorData = { name: 'stimulatorData' };
    const buffer = Buffer.from([]);
    const event = new StimulatorDataEvent(buffer);

    queryBusMock.execute.mockReturnValue([commandID, data]);

    await handler.handle(event);

    expect(eventBusMock.publish).toBeCalledWith(new StimulatorEvent(commandID, data));
  });

  it('negative - should silently handle unsupported stimulator command exception', async () => {
    const buffer = Buffer.from([]);
    const event = new StimulatorDataEvent(buffer);

    queryBusMock.execute.mockImplementationOnce(() => {
      throw new UnsupportedStimulatorCommandException(buffer);
    });

    await handler.handle(event);

    expect(eventBusMock.publish).not.toBeCalled();
  });

  it('negative - should silently handle unknown exception', async () => {
    const buffer = Buffer.from([]);
    const event = new StimulatorDataEvent(buffer);

    queryBusMock.execute.mockImplementationOnce(() => {
      throw new Error();
    });

    await handler.handle(event);

    expect(eventBusMock.publish).not.toBeCalled();
  });
});
