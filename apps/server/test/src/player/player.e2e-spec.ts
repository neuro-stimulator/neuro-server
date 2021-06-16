import { INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';

import { PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { setupFromConfigFile, tearDown } from '../../setup';
import { ENDPOINTS, PLAYER } from '../../helpers/endpoints';

describe('Player', () => {
  const BASE_API = ENDPOINTS[PLAYER];

  let app: INestApplication;
  let agent: SuperAgentTest;
  let dataContainers: DataContainers;

  beforeEach(async () => {
    [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
  });

  afterEach(async () => {
    await tearDown(app);
  });

  describe('getPlayerState()', () => {
    it('positive - should return player state', async () => {
      const response = await agent.get(`${BASE_API}/state`).send().expect(200);
      const responseBody: ResponseObject<PlayerConfiguration> = response.body;
      const configuration: PlayerConfiguration = responseBody.data;

      expect(configuration).toBeDefined();
      expect(configuration).toEqual({
        initialized: false,
        betweenExperimentInterval: 0,
        autoplay: false,
        ioData: [],
        isBreakTime: false,
        repeat: 0,
        stopConditionType: 0,
        stopConditions: {}
      })
    });

  });
});
