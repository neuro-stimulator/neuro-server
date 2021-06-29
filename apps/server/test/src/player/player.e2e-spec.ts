import { HttpStatus, INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';

import { Experiment, ExperimentResult, ExperimentStopConditionType, ExperimentType, Output, PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { setupFromConfigFile, tearDown } from '../../setup';
import { getAllExperiments, groupBy, performLoginFromDataContainer, performLogout, validExperimentTypes } from '../../helpers';
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
      // spuštění serveru
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
      });
    });
  });

  // describe('getStopConditions()', () => {
  //
  //   beforeEach(async () => {
  //     // spuštění serveru
  //     [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
  //   });
  //
  //   it('positive - should return stop conditions', async () => {
  //     const experimentStopConditionDataContainer: DataContainer = dataContainers[ExperimentStopConditionEntity.name][0];
  //     const experimentStopConditionEntities = experimentStopConditionDataContainer.entities as unknown as ExperimentStopConditionEntity[];
  //
  //     const stopConditionsGroups = groupBy(experimentStopConditionEntities, (e: ExperimentStopConditionEntity) => e.experimentType);
  //
  //     for (const experimentType of Object.keys(stopConditionsGroups)) {
  //       const stopConditions: ExperimentStopConditionEntity[] = stopConditionsGroups[experimentType];
  //       const response = await agent.get(`${BASE_API}/stop-conditions/${ExperimentType[experimentType]}`).send().expect(HttpStatus.OK);
  //       const body: ResponseObject<ExperimentStopConditionType[]> = response.body;
  //       const responseStopConditions: ExperimentStopConditionType[] = body.data;
  //
  //       expect(responseStopConditions.length).toEqual(stopConditions.length);
  //
  //       for (const stopCondition of stopConditions) {
  //         expect(responseStopConditions).toContain(ExperimentStopConditionType[stopCondition.experimentStopConditionType]);
  //       }
  //     }
  //   });
  // });

  describe('prepare()', () => {
    const userID = 1;

    beforeEach(async () => {
      // spuštění serveru
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'prepare.config.json');
      // Přihlásím uživatele
      await performLoginFromDataContainer(agent, dataContainers, userID);
    });

    afterEach(async () => {
      await performLogout(agent);
    });

    describe('positive - should prepare experiment player', () => {
      let playerConfiguration: PlayerConfiguration;
      let experiments: Experiment<Output>[];
      let experimentGroups: Record<string, Experiment<Output>[]> = {};

      beforeEach(async () => {
        playerConfiguration = {
          repeat: 0,
          betweenExperimentInterval: 0,
          autoplay: false,
          stopConditionType: ExperimentStopConditionType.NO_STOP_CONDITION,
          stopConditions: {},
          isBreakTime: false,
          ioData: [],
          initialized: false
        };
        experiments = await getAllExperiments(agent);
        experimentGroups = groupBy(experiments, (e: Experiment<Output>) => ExperimentType[e.type]);
      });

      test.each(validExperimentTypes)('Prepare %s experiment()', async (experimentType: string) => {
        const experiment: Experiment<Output> = experimentGroups[experimentType][0];
        const experimentID = experiment.id;

        const response = await agent.post(`${BASE_API}/prepare/${experimentID}`).send(playerConfiguration).expect(HttpStatus.CREATED);
        const body: ResponseObject<ExperimentResult> = response.body;
        const experimentResult = body.data;

        const expectedExperimentResult: jest.experimentResults.ExperimentResultType = {
          experimentID,
          type: experiment.type,
          outputCount: experiment.outputCount,
          name: null
        };

        expect(experimentResult).toMatchExperimentResultType(expectedExperimentResult);
      });
    });
  });
});
