import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { EntityManager } from 'typeorm';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserEntity, UserIdNotFoundException, UserNotFoundException, UsersRepository, userToEntity } from '@diplomka-backend/stim-feature-users/domain';

import { repositoryUserEntityMock, usersRepositoryProvider } from './repository-providers.jest';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let testingModule: TestingModule;
  let service: UsersService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        usersRepositoryProvider,
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [UsersRepository],
        },
      ],
    }).compile();

    service = testingModule.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available user results', async () => {
      const user: User = createEmptyUser();
      const entityFromDB: UserEntity = userToEntity(user);

      repositoryUserEntityMock.find.mockReturnValue([entityFromDB]);

      const result = await service.findAll();

      expect(result).toEqual([user]);
    });
  });

  describe('byId()', () => {
    it('positive - should return user by id', async () => {
      const user: User = createEmptyUser();
      user.id = 1;
      const entityFromDB: UserEntity = userToEntity(user);

      repositoryUserEntityMock.findOne.mockReturnValue(entityFromDB);

      const result = await service.byId(user.id);

      expect(result).toEqual(user);
    });

    it('negative - should not return any user', async (done: DoneCallback) => {
      const userID = 1;

      repositoryUserEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.byId(userID);
        done.fail('UserIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof UserIdNotFoundException) {
          expect(e.userID).toBe(userID);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('byEmail()', () => {
    it('positive - should return user by email', async () => {
      const user: User = createEmptyUser();
      user.email = 'aaa@bbb.ccc';
      const entityFromDB: UserEntity = userToEntity(user);

      repositoryUserEntityMock.findOne.mockReturnValue(entityFromDB);

      const result = await service.byEmail(user.email);

      expect(result).toEqual(user);
    });

    it('negative - should not return any user', async (done: DoneCallback) => {
      const email = 'aaa@bbb.ccc';

      repositoryUserEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.byEmail(email);
        done.fail('UserNotFoundException was not thrown!');
      } catch (e) {
        if (e instanceof UserNotFoundException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('insert()', () => {
    it('positive - should insert user result to database', async () => {
      const user: User = createEmptyUser();
      const userEntityFromDB: UserEntity = userToEntity(user);

      repositoryUserEntityMock.insert.mockReturnValue({ raw: 1 });

      await service.insert(user);

      expect(repositoryUserEntityMock.insert).toBeCalledWith(userEntityFromDB);
    });
  });

  describe('update()', () => {
    it('positive - should update existing user result in database', async () => {
      const user: User = createEmptyUser();
      user.id = 1;
      const userEntityFromDB: UserEntity = userToEntity(user);

      repositoryUserEntityMock.findOne.mockReturnValue(userEntityFromDB);

      await service.update(user);

      expect(repositoryUserEntityMock.update).toBeCalledWith({ id: user.id }, userEntityFromDB);
    });

    it('negative - should not update non existing user result', async (done: DoneCallback) => {
      const user: User = createEmptyUser();
      user.id = 1;
      repositoryUserEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.update(user);
        done.fail('UserIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof UserIdNotFoundException) {
          expect(e.userID).toBe(user.id);
          expect(repositoryUserEntityMock.update).not.toBeCalled();
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing user result from database', async () => {
      const user: User = createEmptyUser();
      user.id = 1;
      const userEntityFromDB: UserEntity = userToEntity(user);

      repositoryUserEntityMock.findOne.mockReturnValue(userEntityFromDB);

      await service.delete(user.id);

      expect(repositoryUserEntityMock.delete).toBeCalled();
    });

    it('negative - should not delete non existing user result', async (done: DoneCallback) => {
      const userID = 1;
      repositoryUserEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.delete(userID);
        done.fail('UserIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof UserIdNotFoundException) {
          expect(e.userID).toBe(userID);
          expect(repositoryUserEntityMock.delete).not.toBeCalled();
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
