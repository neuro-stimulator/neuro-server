import { MockType } from '../../../../../../test-helpers/test-helpers';
import { UsersService } from './users.service';

export const createUsersServiceMock: () => MockType<UsersService> = jest.fn(() => ({
  findAll: jest.fn(),
  byId: jest.fn(),
  byEmail: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));
