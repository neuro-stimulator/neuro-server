import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createTriggersServiceMock } from '../../service/triggers.service.jest';
import { TriggersService } from '../../service/triggers.service';
import { EnableTriggersCommand } from '../impl/enable-triggers.command';
import { EnableTriggersHandler } from './enable-triggers.handler';

describe('EnableTriggersHandler', () => {
  let testingModule: TestingModule;
  let handler: EnableTriggersHandler;
  let service: MockType<TriggersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        EnableTriggersHandler,
        {
          provide: TriggersService,
          useFactory: createTriggersServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<EnableTriggersHandler>(EnableTriggersHandler);
    // @ts-ignore
    service = testingModule.get<MockType<TriggersService>>(TriggersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call enableAll on service when no trigger specified', async () => {
    const command = new EnableTriggersCommand();

    await handler.execute(command);

    expect(service.enableAll).toBeCalled();
    expect(service.enable).not.toBeCalled();
  });

  it('positive - should call enable for each trigger', async () => {
    const triggerNames = ['trigger1', 'trigger2'];
    const command = new EnableTriggersCommand(triggerNames);

    await handler.execute(command);

    expect(service.enableAll).not.toBeCalled();
    expect(service.enable).toBeCalledTimes(triggerNames.length);
  });
});
