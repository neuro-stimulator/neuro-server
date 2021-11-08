import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, MessageCodes, ResponseObject, User } from '@stechy1/diplomka-share';

import { UserNotValidException, UserWasNotRegistredException } from '@neuro-server/stim-feature-users/domain';
import { ControllerException, ValidationErrors } from '@neuro-server/stim-lib-common';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { UsersFacade } from '../service/users.facade';
import { createUsersFacadeMock } from '../service/users.facade.jest';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let testingModule: TestingModule;
  let controller: UsersController;
  let facade: MockType<UsersFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersFacade,
          useFactory: createUsersFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<UsersController>(UsersController);
    // @ts-ignore
    facade = testingModule.get<MockType<UsersFacade>>(UsersFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('positive - should register new user', async () => {
      const user: User = createEmptyUser();

      const result: ResponseObject<void> = await controller.register(user);
      const expected: ResponseObject<void> = {};

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when user not valid', () => {
      const user: User = createEmptyUser();
      const errors: ValidationErrors = [];

      facade.register.mockImplementationOnce(() => {
        throw new UserNotValidException(user, errors);
      });

      expect(() => controller.register(user))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_USER_NOT_VALID, { errors }));
    });

    it('negative - should throw exception when user was not registred', () => {
      const user: User = createEmptyUser();

      facade.register.mockImplementationOnce(() => {
        throw new UserWasNotRegistredException(user);
      });

      expect(() => controller.register(user))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_USER_NOT_REGISTRED, { user }));
    });
  });
});
