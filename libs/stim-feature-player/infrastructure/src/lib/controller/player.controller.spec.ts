import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { PlayerFacade } from '../service/player.facade';
import { PlayerController } from './player.controller';
import { createPlayerFacadeMock } from '../service/player.facade.jest';
import { ExperimentType, ResponseObject } from '@stechy1/diplomka-share';

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
    const options = {};

    facade.prepare.mockReturnValueOnce({});

    const result: ResponseObject<any> = await controller.prepare(experimentID, options);
    const expected: ResponseObject<any> = {};

    expect(result).toEqual(expected);
  });
});
