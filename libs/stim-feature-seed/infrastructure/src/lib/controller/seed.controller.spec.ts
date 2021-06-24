import { Test, TestingModule } from '@nestjs/testing';

import { ResponseObject } from '@stechy1/diplomka-share';

import { SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SeedFacade } from '../service/seed.facade';
import { createSeedFacadeMock } from '../service/seed.facade.jest';
import { SeedController } from './seed.controller';
import { ControllerException } from '@diplomka-backend/stim-lib-common';

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

    it('negative - should throw exception when unexpected error occured', () => {
      facade.seed.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.seed()).rejects.toThrow(new ControllerException());
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

    it('negative - should throw exception when unexpected error occured', () => {
      facade.truncate.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.truncate()).rejects.toThrow(new ControllerException());
    });
  });
});
