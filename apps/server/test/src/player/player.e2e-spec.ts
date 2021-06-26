import { INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';

import { ExperimentStopConditionType, ExperimentType, PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { DataContainer, DataContainers } from '@diplomka-backend/stim-feature-seed/domain';
import { ExperimentStopConditionEntity } from '@diplomka-backend/stim-feature-player/domain';

import { setupFromConfigFile, tearDown } from '../../setup';
import { ExperimentTypeStopConditionMap, groupBy } from '../../helpers';
import { ENDPOINTS, PLAYER } from '../../helpers/endpoints';

describe('Player', () => {
  const BASE_API = ENDPOINTS[PLAYER];

  let app: INestApplication;
  let agent: SuperAgentTest;
  let dataContainers: DataContainers;


  afterEach(async () => {
    await tearDown(app);
  });

  describe('getPlayerState()', () => {

    beforeEach(async () => {
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    });

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

  describe('getStopConditions()', () => {

    beforeEach(async () => {
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    });

    it('positive - should return stop conditions', async () => {
      const experimentStopConditionDataContainer: DataContainer = dataContainers[ExperimentStopConditionEntity.name][0];
      const experimentStopConditionEntities = experimentStopConditionDataContainer.entities as unknown as ExperimentTypeStopConditionMap[];

      const stopConditionsGroups = groupBy(experimentStopConditionEntities, e => e.experimentType);

      for (const experimentType of Object.keys(stopConditionsGroups)) {
        const stopConditions: ExperimentTypeStopConditionMap[] = stopConditionsGroups[experimentType];
        const response = await agent.get(`${BASE_API}/stop-conditions/${ExperimentType[experimentType]}`).send().expect(200);
        const body: ResponseObject<ExperimentStopConditionType[]> = response.body;
        const responseStopConditions: ExperimentStopConditionType[] = body.data;

        expect(responseStopConditions.length).toEqual(stopConditions.length);

        for (const stopCondition of stopConditions) {
          expect(responseStopConditions).toContain(ExperimentStopConditionType[stopCondition.experimentStopConditionType]);
        }
      }
    });
  });
});
