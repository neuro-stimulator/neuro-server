import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { TvepOutput, Experiment, ExperimentTVEP, ResponseObject, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentTvepEntity, ExperimentTvepOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { insertExperimentFromDataContainers, performLoginFromDataContainer } from '../../../helpers';
import { ENDPOINTS, EXPERIMENTS } from '../../../helpers/endpoints';

describe('Experiment TVEP', () => {
  const BASE_API = `${ENDPOINTS[EXPERIMENTS]}`;
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

  it('positive - should update existing TVEP experiment', async () => {
    // načtu lokální datakontejnery
    const tvepDataContainers = await readDataContainers('experiments/tvep');
    // vložím TVEP experiment do databáze
    const tvepExperiment: ExperimentTVEP = await insertExperimentFromDataContainers(agent, tvepDataContainers, ExperimentType.TVEP);

    tvepExperiment.name = 'tvep-updated';

    const response = await agent.patch(BASE_API).send(tvepExperiment).expect(200);
    const body: ResponseObject<ExperimentTVEP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(tvepExperiment);
  });

  it('positive - should delete existing TVEP experiment', async () => {
    // načtu lokální datakontejnery
    const tvepDataContainers = await readDataContainers('experiments/tvep');
    // vložím TVEP experiment do databáze
    const tvepExperiment: ExperimentTVEP = await insertExperimentFromDataContainers(agent, tvepDataContainers, ExperimentType.TVEP);

    const response = await agent.delete(`${BASE_API}/${tvepExperiment.id}`).send().expect(200);
    const body: ResponseObject<ExperimentTVEP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(tvepExperiment);
  });
});
