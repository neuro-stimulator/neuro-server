import { Test, TestingModule } from '@nestjs/testing';

import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserEntity, UserIdNotFoundException, UserNotFoundException, UsersRepository, userToEntity } from '@diplomka-backend/stim-feature-users/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
    testingModule.useLogger(new NoOpLogger());

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
      const userGroups = [1];
      const user: User = createEmptyUser();
      const entityFromDB: UserEntity = userToEntity(user);

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getMany.mockReturnValue([entityFromDB]);

      const result = await service.findAll({ userGroups });

      expect(result).toEqual([user]);
    });
  });

  describe('byId()', () => {
    it('positive - should return user by id', async () => {
      const user: User = createEmptyUser();
      user.id = 1;
      const entityFromDB: UserEntity = userToEntity(user);

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(entityFromDB);

      const result = await service.byId(user.id);

      expect(result).toEqual(user);
    });

    it('negative - should not return any user', () => {
      const userID = 1;

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(undefined);

      expect(() => service.byId(userID)).rejects.toThrow(new UserIdNotFoundException(userID));
    });
  });

  describe('byEmail()', () => {
    it('positive - should return user by email', async () => {
      const user: User = createEmptyUser();
      user.email = 'aaa@bbb.ccc';
      const entityFromDB: UserEntity = userToEntity(user);

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(entityFromDB);

      const result = await service.byEmail(user.email);

      expect(result).toEqual(user);
    });

    it('negative - should not return any user', () => {
      const email = 'aaa@bbb.ccc';

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(undefined);

      expect(() => service.byEmail(email)).rejects.toThrow(new UserNotFoundException());
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

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(userEntityFromDB);

      await service.update(user);

      expect(repositoryUserEntityMock.update).toBeCalledWith({ id: user.id }, userEntityFromDB);
    });

    it('negative - should not update non existing user result', () => {
      const user: User = createEmptyUser();
      user.id = 1;

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(undefined);

      expect(() => service.update(user)).rejects.toThrow(new UserIdNotFoundException(user.id));
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing user result from database', async () => {
      const user: User = createEmptyUser();
      user.id = 1;
      const userEntityFromDB: UserEntity = userToEntity(user);

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(userEntityFromDB);

      await service.delete(user.id);

      expect(repositoryUserEntityMock.delete).toBeCalled();
    });

    it('negative - should not delete non existing user result', () => {
      const userID = 1;

      (repositoryUserEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValue(undefined);

      expect(() => service.delete(userID)).rejects.toThrow(new UserIdNotFoundException(userID));
    });
  });
});
