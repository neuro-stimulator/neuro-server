import { EntityManager, InsertResult } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentStopConditionType, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentStopConditionEntity, ExperimentStopConditionRepository } from '@neuro-server/stim-feature-player/domain';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { experimentStopConditionRepositoryProvider, repositoryExperimentStopConditionEntityMock } from './repository-providers.jest';
import { StopConditionsService } from './stop-conditions.service';

describe('StopConditionsService', () => {
  let testingModule: TestingModule;
  let service: StopConditionsService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StopConditionsService,
        experimentStopConditionRepositoryProvider,
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [ExperimentStopConditionRepository],
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<StopConditionsService>(StopConditionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('stopConditionsForExperimentType()', () => {
    it('positive - should return stop conditions by experiment type', async () => {
      const experimentType: ExperimentType = ExperimentType.NONE;
      const stopConditionEntity: ExperimentStopConditionEntity = new ExperimentStopConditionEntity();
      stopConditionEntity.experimentType = ExperimentType[ExperimentType.NONE];
      stopConditionEntity.experimentStopConditionType = 'NO_STOP_CONDITION';
      const stopConditions = [stopConditionEntity];

      repositoryExperimentStopConditionEntityMock.find.mockReturnValueOnce(stopConditions);

      const experimentStopConditionTypes: ExperimentStopConditionType[] = await service.stopConditionsForExperimentType(experimentType);

      expect(repositoryExperimentStopConditionEntityMock.find).toBeCalledWith({ where: { experimentType: ExperimentType[experimentType] } });
      expect(experimentStopConditionTypes).toStrictEqual([ExperimentStopConditionType.NO_STOP_CONDITION]);
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment stop condition', async () => {
      const experimentType: ExperimentType = ExperimentType.NONE;
      const stopCondition: ExperimentStopConditionType = ExperimentStopConditionType.COUNTING_EXPERIMENT_STOP_CONDITION;
      const insertReturn: InsertResult = new InsertResult();
      insertReturn.raw = 1;

      repositoryExperimentStopConditionEntityMock.insert.mockReturnValueOnce(insertReturn);

      const number = await service.insert(experimentType, stopCondition);

      expect(number).toBe(insertReturn.raw);
    });
  });
});
