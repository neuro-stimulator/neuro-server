import { Test, TestingModule } from '@nestjs/testing';

import { Acl, createEmptyAcl } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { AclReloadCommand } from '../impl/acl-reload.command';

import { AclReloadHandler } from './acl-reload.handler';

describe('AclReloadHandler', () => {

  let testingModule: TestingModule;
  let handler: AclReloadHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AclReloadHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock
        },
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<AclReloadHandler>(AclReloadHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - reload acl from entities', async () => {
    const acl: Acl[] = [createEmptyAcl()];
    const command = new AclReloadCommand(acl)

    await handler.execute(command);

    expect(service.reloadAcl).toBeCalledWith(acl);
  });
});
