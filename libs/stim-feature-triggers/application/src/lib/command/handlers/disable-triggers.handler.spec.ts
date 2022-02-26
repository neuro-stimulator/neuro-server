import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { TriggersService } from '../../service/triggers.service';
import { createTriggersServiceMock } from '../../service/triggers.service.jest';
import { DisableTriggersCommand } from '../impl/disable-triggers.command';

import { DisableTriggersHandler } from './disable-triggers.handler';

describe('DisableTriggersHandler', () => {
  let testingModule: TestingModule;
  let handler: DisableTriggersHandler;
  let service: MockType<TriggersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        DisableTriggersHandler,
        {
          provide: TriggersService,
          useFactory: createTriggersServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<DisableTriggersHandler>(DisableTriggersHandler);
    // @ts-ignore
    service = testingModule.get<MockType<TriggersService>>(TriggersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call enableAll on service when no trigger specified', async () => {
    const command = new DisableTriggersCommand();

    await handler.execute(command);

    expect(service.disableAll).toBeCalled();
    expect(service.disable).not.toBeCalled();
  });

  it('positive - should call disable for each trigger', async () => {
    const triggerNames = ['trigger1', 'trigger2'];
    const command = new DisableTriggersCommand(triggerNames);

    await handler.execute(command);

    expect(service.disableAll).not.toBeCalled();
    expect(service.disable).toBeCalledTimes(triggerNames.length);
  });
});
