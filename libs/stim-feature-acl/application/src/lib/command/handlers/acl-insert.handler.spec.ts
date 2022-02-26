import { QueryFailedError } from 'typeorm';

import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Acl, createEmptyAcl } from '@stechy1/diplomka-share';

import { AclNotCreatedException } from '@neuro-server/stim-feature-acl/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclWasCreatedEvent } from '../../event/impl/acl-was-created.event';
import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { AclInsertCommand } from '../impl/acl-insert.command';

import { AclInsertHandler } from './acl-insert.handler';

describe('AclInsertHandler', () => {
  let testingModule: TestingModule;
  let handler: AclInsertHandler;
  let service: MockType<AclService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AclInsertHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<AclInsertHandler>(AclInsertHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.insert.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should insert experiment', async () => {
    const acl: Acl = createEmptyAcl();
    acl.id = 1;
    const command = new AclInsertCommand(acl);

    service.insert.mockReturnValue(acl.id);

    const result = await handler.execute(command);

    expect(result).toEqual(acl.id);
    expect(service.insert).toBeCalledWith(acl);
    expect(eventBus.publish).toBeCalledWith(new AclWasCreatedEvent(acl.id));
  });

  it('negative - should throw exception when experiment not created', () => {
    const acl: Acl = createEmptyAcl();
    acl.id = 1;
    const command = new AclInsertCommand(acl);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new AclNotCreatedException(acl));
  });

  it('negative - should throw exception when unknown error', () => {
    const acl: Acl = createEmptyAcl();
    acl.id = 1;
    const command = new AclInsertCommand(acl);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new AclNotCreatedException(acl));
  });
});
