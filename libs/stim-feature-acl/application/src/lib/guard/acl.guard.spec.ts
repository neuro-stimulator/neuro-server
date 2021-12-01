import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { createMock } from '@golevelup/ts-jest';

import { Acl, createEmptyAcl, createEmptyUser, User } from '@stechy1/diplomka-share';

import { ACL_MODULE_CONFIG_CONSTANT, AclModuleConfig } from '@neuro-server/stim-feature-acl/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../service/acl.service';
import { createAclServiceMock } from '../service/acl.service.jest';
import { AclGuard } from './acl.guard';
import { Permission } from 'accesscontrol';

describe('AclGuard', () => {

  const config: AclModuleConfig = {
    enabled: true
  };

  let testingModule: TestingModule;
  let guard: AclGuard;
  let service: MockType<AclService>;
  let reflector: MockType<Reflector>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AclGuard,
        {
          provide: AclService,
          useFactory: createAclServiceMock
        },
        {
          provide: ACL_MODULE_CONFIG_CONSTANT,
          useValue: config
        },
        {
          provide: Reflector,
          useValue: createMock<Reflector>()
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    guard = testingModule.get<AclGuard>(AclGuard);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
    // @ts-ignore
    reflector = testingModule.get<MockType<Reflector>>(Reflector);
  });

  function prepareExecutionContext(user: User): ExecutionContext {
    return createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user
        })
      }),
      getHandler: jest.fn()
    });
  }

  function preparePermission(granted: boolean): Permission {
    return createMock<Permission>({
      granted
    });
  }

  it('positive - should be defined', () => {
    expect(guard).toBeDefined();
  })

  it('positive - should allow access when ACL are disabled', () => {
    const context: ExecutionContext = createMock<ExecutionContext>();
    config.enabled = false;

    expect(guard.canActivate(context)).resolves.toBeTruthy();
  });

  it('positive - should allow access when no roles are defined', () => {
    const context: ExecutionContext = createMock<ExecutionContext>();

    reflector.get.mockReturnValueOnce(undefined);

    expect(guard.canActivate(context)).resolves.toBeTruthy();
  });

  it('positive - should allow access when roles are defined and allowed', () => {
    const acl: Acl[] = [createEmptyAcl()];
    const user: User = createEmptyUser();
    user.acl = acl;
    const context: ExecutionContext = prepareExecutionContext(user);
    const permission: Permission = preparePermission(true);

    service.getPermission.mockReturnValueOnce(permission);

    expect(guard.canActivate(context)).resolves.toBeTruthy();
  });
});
