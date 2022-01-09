import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentType } from '@stechy1/diplomka-share';

import { createDtoProvider, DtoService, getDtoInjectionToken } from '@neuro-server/stim-lib-dto';
import { DTO_SCOPE, DTOs } from '@neuro-server/stim-feature-experiments/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentsRegisterDtoCommand } from '../impl/experiments-register-dto.command';
import { ExperimentsRegisterDtoHandler } from './experiments-register-dto.handler';

describe('RegisterDtoHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentsRegisterDtoHandler;
  let service: MockType<DtoService<ExperimentType>>;

  beforeEach(async () => {
    // @ts-ignore
    const dtoProvider = createDtoProvider<ExperimentType>(DTO_SCOPE, () => {
      return {
        getDTO: jest.fn(),
        registerDTO: jest.fn(),
      };
    });

    testingModule = await Test.createTestingModule({
      providers: [ExperimentsRegisterDtoHandler, dtoProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentsRegisterDtoHandler>(ExperimentsRegisterDtoHandler);
    // @ts-ignore
    service = testingModule.get<MockType<DtoService<ExperimentType>>>(getDtoInjectionToken(DTO_SCOPE));
  });

  it('positive - should register all DTOs', async () => {
    const command = new ExperimentsRegisterDtoCommand(DTOs);

    await handler.execute(command);

    expect(service.registerDTO).toBeCalledTimes(Object.entries(DTOs).length);
  });
});
