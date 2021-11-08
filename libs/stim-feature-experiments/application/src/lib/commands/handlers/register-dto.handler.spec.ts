import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { DTOs } from '@neuro-server/stim-feature-experiments/domain';
import { DtoFactory } from '@neuro-server/stim-lib-common';

import { RegisterDtoCommand } from '../impl/register-dto.command';
import { RegisterDtoHandler } from './register-dto.handler';

describe('RegisterDtoHandler', () => {
  let testingModule: TestingModule;
  let handler: RegisterDtoHandler;
  let factory: MockType<DtoFactory>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RegisterDtoHandler,
        {
          provide: DtoFactory,
          useValue: {
            registerDTO: jest.fn(),
          },
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<RegisterDtoHandler>(RegisterDtoHandler);
    // @ts-ignore
    factory = testingModule.get<MockType<DtoFactory>>(DtoFactory);
  });

  it('positive - should register all DTOs', async () => {
    const command = new RegisterDtoCommand(DTOs);

    await handler.execute(command);

    expect(factory.registerDTO).toBeCalledTimes(Object.entries(DTOs).length);
  });
});
