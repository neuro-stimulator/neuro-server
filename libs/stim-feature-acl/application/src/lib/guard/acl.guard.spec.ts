import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessControl, AccessControlError, Permission } from 'accesscontrol';

import { createMock } from '@golevelup/ts-jest';

import { Acl, createEmptyAcl, createEmptyUser, User } from '@stechy1/diplomka-share';

import { ACL_MODULE_CONFIG_CONSTANT, AclModuleConfig, PermissionDeniedException } from '@neuro-server/stim-feature-acl/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../service/acl.service';
import { createAclServiceMock } from '../service/acl.service.jest';
import { AclGuard } from './acl.guard';

describe('AclGuard', () => {

  const configFactory: () => AclModuleConfig = () => {
    return {
      enabled: true
    };
  };

  let testingModule: TestingModule;
  let guard: AclGuard;
  let service: MockType<AclService>;
  let reflector: MockType<Reflector>;
  let config: AclModuleConfig;

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
          useFactory: configFactory
        },
        {
          provide: Reflector,
          useValue: createMock<Reflector>()
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    guard = testingModule.get<AclGuard>(AclGuard);
    config = testingModule.get<AclModuleConfig>(ACL_MODULE_CONFIG_CONSTANT);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
    // @ts-ignore
    reflector = testingModule.get<MockType<Reflector>>(Reflector);
  });

  function prepareExecutionContext(user: User = createEmptyUser()): ExecutionContext {
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
    const context: ExecutionContext = prepareExecutionContext();
    config.enabled = false;

    expect(guard.canActivate(context)).resolves.toBeTruthy();
  });

  it('positive - should allow access when no roles are defined', () => {
    const context: ExecutionContext = prepareExecutionContext();

    reflector.get.mockReturnValueOnce(undefined);

    expect(guard.canActivate(context)).resolves.toBeTruthy();
    expect(reflector.get).toBeCalled();
  });

  it('positive - should allow access when roles are defined and allowed', () => {
    const acl: Acl[] = [createEmptyAcl()];
    const user: User = createEmptyUser();
    user.acl = acl;
    const context: ExecutionContext = prepareExecutionContext(user);
    const permission: Permission = preparePermission(true);

    reflector.get.mockReturnValueOnce(acl);
    service.getPermission.mockReturnValueOnce(permission);

    expect(guard.canActivate(context)).resolves.toBeTruthy();
    expect(reflector.get).toBeCalled();
  });

  it('negative - should throw exception when permission denied', () => {
    const acl: Acl[] = [createEmptyAcl()];
    const user: User = createEmptyUser();
    user.acl = acl;
    const context: ExecutionContext = prepareExecutionContext(user);
    const error: AccessControlError = new AccessControl.Error('');

    reflector.get.mockReturnValueOnce(acl);
    service.getPermission.mockImplementationOnce(() => {
      throw error;
    })

    expect(guard.canActivate(context)).rejects.toThrow(new PermissionDeniedException(error));
  });

  it('negative - should re-throw exception when unknown error is thrown', () => {
    const acl: Acl[] = [createEmptyAcl()];
    const user: User = createEmptyUser();
    user.acl = acl;
    const context: ExecutionContext = prepareExecutionContext(user);
    const error: AccessControlError = new Error();

    reflector.get.mockReturnValueOnce(acl);
    service.getPermission.mockImplementationOnce(() => {
      throw error;
    })

    expect(guard.canActivate(context)).rejects.toThrow(error);
  });
});
