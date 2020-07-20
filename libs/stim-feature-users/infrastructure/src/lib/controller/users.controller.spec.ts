import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptyUser, MessageCodes, ResponseObject, User } from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { UsersFacade } from '../service/users.facade';
import { createUsersFacadeMock } from '../service/users.facade.jest';
import { UsersController } from './users.controller';
import { UserNotValidException, UserWasNotRegistredException } from '@diplomka-backend/stim-feature-users/domain';
import { ControllerException, ValidationErrors } from '@diplomka-backend/stim-lib-common';

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

    it('negative - should throw exception when user not valid', async (done: DoneCallback) => {
      const user: User = createEmptyUser();
      const errors: ValidationErrors = [];

      facade.register.mockImplementationOnce(() => {
        throw new UserNotValidException(user, errors);
      });

      try {
        await controller.register(user);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
          expect(e.params).toEqual(errors);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when user was not registred', async (done: DoneCallback) => {
      const user: User = createEmptyUser();

      facade.register.mockImplementationOnce(() => {
        throw new UserWasNotRegistredException(user);
      });

      try {
        await controller.register(user);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
          expect(e.params).toEqual({ user });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
