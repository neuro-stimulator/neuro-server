import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { DTOs } from '@neuro-server/stim-feature-experiments/domain';
import { DtoFactory } from '@neuro-server/stim-lib-common';

import { ExperimentsRegisterDtoCommand } from '../impl/experiments-register-dto.command';
import { ExperimentsRegisterDtoHandler } from './experiments-register-dto.handler';

describe('RegisterDtoHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentsRegisterDtoHandler;
  let factory: MockType<DtoFactory>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentsRegisterDtoHandler,
        {
          provide: DtoFactory,
          useValue: {
            registerDTO: jest.fn(),
          },
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentsRegisterDtoHandler>(ExperimentsRegisterDtoHandler);
    // @ts-ignore
    factory = testingModule.get<MockType<DtoFactory>>(DtoFactory);
  });

  it('positive - should register all DTOs', async () => {
    const command = new ExperimentsRegisterDtoCommand(DTOs);

    await handler.execute(command);

    expect(factory.registerDTO).toBeCalledTimes(Object.entries(DTOs).length);
  });
});
