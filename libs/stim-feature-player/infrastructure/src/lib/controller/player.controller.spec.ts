import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentStopConditionType, PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { PlayerFacade } from '../service/player.facade';
import { PlayerController } from './player.controller';
import { createPlayerFacadeMock } from '../service/player.facade.jest';

describe('PlayerFacade', () => {
  let testingModule: TestingModule;
  let controller: PlayerController;
  let facade: MockType<PlayerFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerController,
        {
          provide: PlayerFacade,
          useFactory: createPlayerFacadeMock,
        },
      ],
    }).compile();

    controller = testingModule.get<PlayerController>(PlayerController);
    // @ts-ignore
    facade = testingModule.get<MockType<PlayerFacade>>(PlayerFacade);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('positive - should prepare experiment player', async () => {
    const experimentID = 1;
    const playerConfiguration: PlayerConfiguration = {
      repeat: 0,
      betweenExperimentInterval: 0,
      autoplay: false,
      stopConditionType: -1,
      stopConditions: {},
    };
    facade.prepare.mockReturnValueOnce({});

    const result: ResponseObject<any> = await controller.prepare(experimentID, playerConfiguration);
    const expected: ResponseObject<any> = {};

    expect(result).toEqual(expected);
  });
});
