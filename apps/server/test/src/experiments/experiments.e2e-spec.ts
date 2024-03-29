import { SuperAgentTest } from 'supertest';

import { INestApplication } from '@nestjs/common';

import { Experiment, Output, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentEntity } from '@neuro-server/stim-feature-experiments/domain';
import { DataContainers } from '@neuro-server/stim-feature-seed/domain';

import { performLoginFromDataContainer } from '../../helpers';
import { ENDPOINTS, EXPERIMENTS } from '../../helpers/endpoints';
import { setupFromConfigFile, tearDown } from '../../setup';

describe('Experiments', () => {
  const BASE_API = `${ENDPOINTS[EXPERIMENTS]}`;
  const userID = 1;

  let app: INestApplication;
  let agent: SuperAgentTest;

  afterEach(async () => {
    await tearDown(app);
  });

  describe('all', () => {
    let dataContainers: DataContainers;

    beforeEach(async () => {
      [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
      await performLoginFromDataContainer(agent, dataContainers, userID);
    });

    it('positive - should return all experiments for one user', async () => {
      const experiments: ExperimentEntity[] = ((dataContainers[ExperimentEntity.name][0].entities as unknown) as ExperimentEntity[]).filter(
        (experiment: ExperimentEntity) => experiment.userId == userID
      );
      const response = await agent.get(BASE_API).expect(200);
      const body: ResponseObject<Experiment<Output>[]> = response.body;

      expect(body.data).toMatchExperiment(experiments);
    });
  });
});
