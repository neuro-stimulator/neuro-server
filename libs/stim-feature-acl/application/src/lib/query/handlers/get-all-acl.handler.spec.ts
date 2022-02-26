import { Test, TestingModule } from '@nestjs/testing';

import { Acl } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetAllAclQuery } from '../impl/get-all-acl.query';

import { GetAllAclHandler } from './get-all-acl.handler';

describe('GetAllAclHandler', () => {
  let testingModule: TestingModule;
  let handler: GetAllAclHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetAllAclHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetAllAclHandler>(GetAllAclHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should get all acl by defined roles', () => {
    const acl: Acl[] = [];
    const query = new GetAllAclQuery();

    service.getAllAcl.mockReturnValueOnce(acl);

    expect(handler.execute(query)).resolves.toEqual(acl);
  });
});
