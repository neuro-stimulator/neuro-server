import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Acl, createEmptyAcl } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';

import { AclApplicationReadyHandler } from './acl-application-ready.handler';
import { ReloadAclCommand } from '../../command/impl/reload-acl.command';

describe('AclApplicationReadyHandler', () => {

  let testingModule: TestingModule;
  let handler: AclApplicationReadyHandler;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AclApplicationReadyHandler,
        queryBusProvider,
        commandBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<AclApplicationReadyHandler>(AclApplicationReadyHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should request all ACL and trigger reload', async () => {
    const acl: Acl[] = [createEmptyAcl()];
    const event = new ApplicationReadyEvent();

    queryBus.execute.mockReturnValueOnce(acl);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new ReloadAclCommand(acl));
  });
});
