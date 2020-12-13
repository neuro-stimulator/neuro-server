import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SeedFacade } from '../service/seed.facade';
import { createSeedFacadeMock } from '../service/seed.facade.jest';
import { SeedController } from './seed.controller';
import { ResponseObject } from '@stechy1/diplomka-share';

describe('SeedController', () => {
  let testingModule: TestingModule;
  let controller: SeedController;
  let facade: MockType<SeedFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        {
          provide: SeedFacade,
          useFactory: createSeedFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<SeedController>(SeedController);
    // @ts-ignore
    facade = testingModule.get<MockType<SeedFacade>>(SeedFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('seed', () => {
    it('positive - should seed database', async () => {
      const statistics: SeedStatistics = {};

      facade.seed.mockReturnValueOnce(statistics);

      const result: ResponseObject<SeedStatistics> = await controller.seed();
      const expectedResult: ResponseObject<SeedStatistics> = {
        data: statistics,
      };

      expect(result).toEqual(expectedResult);
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      facade.seed.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await controller.seed();
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        done();
      }
    });
  });

  describe('deleteDatabase', () => {
    it('positive - should truncate database', async () => {
      const statistics: SeedStatistics = {};

      facade.truncate.mockReturnValueOnce(statistics);

      const result: ResponseObject<SeedStatistics> = await controller.truncate();
      const expectedResult: ResponseObject<SeedStatistics> = {
        data: statistics,
      };

      expect(result).toEqual(expectedResult);
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      facade.truncate.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await controller.truncate();
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        done();
      }
    });
  });
});
