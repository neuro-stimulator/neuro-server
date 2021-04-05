import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { TvepOutput, Experiment, ExperimentTVEP, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentTvepEntity, ExperimentTvepOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { performLoginFromDataContainer } from '../../../helpers';

describe('Experiment TVEP', () => {
  const BASE_API = '/api/experiments';
  const userID = 1;

  let app: INestApplication;
  let agent: SuperAgentTest;
  let dataContainers: DataContainers;

  beforeEach(async () => {
    [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    await performLoginFromDataContainer(agent, dataContainers, userID);
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it('positive - should create new TVEP experiment', async () => {
    const tvepDataContainers = await readDataContainers('experiments/tvep');
    const experiment = (tvepDataContainers[ExperimentEntity.name][0].entities[0] as unknown) as ExperimentEntity;
    const tvepPart = tvepDataContainers[ExperimentTvepEntity.name][0].entities[0] as Omit<ExperimentTVEP, keyof Experiment<TvepOutput>>;
    const tvepOutputs = (tvepDataContainers[ExperimentTvepOutputEntity.name][0].entities as unknown) as ExperimentTvepOutputEntity[];
    const tvepExperiment: jest.experiments.ExperimentEntityFullType = { ...experiment, ...tvepPart, outputs: [] };

    const response = await agent.post(BASE_API).send(tvepExperiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentTVEP> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(tvepExperiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(tvepOutputs);
  });
});
