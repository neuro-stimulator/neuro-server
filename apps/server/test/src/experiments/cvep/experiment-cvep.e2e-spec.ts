import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ExperimentCVEP, ExperimentType, ResponseObject } from '@stechy1/diplomka-share';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { extractExperimentFromDataContainers, insertExperimentFromDataContainers, performLoginFromDataContainer } from '../../../helpers';
import { ENDPOINTS, EXPERIMENTS } from '../../../helpers/endpoints';

describe('Experiment CVEP', () => {
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

  it('positive - should create new CVEP experiment', async () => {
    // načtu lokální datakontejnery
    const cvepDataContainers = await readDataContainers('experiments/cvep');

    const { experiment, outputs } = extractExperimentFromDataContainers(cvepDataContainers, ExperimentType.CVEP);

    const response = await agent.post(BASE_API).send(experiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentCVEP> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(experiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(outputs);
  });

  it('positive - should update existing CVEP experiment', async () => {
    // načtu lokální datakontejnery
    const cvepDataContainers = await readDataContainers('experiments/cvep');
    // vložím CVEP experiment do databáze
    const cvepExperiment: ExperimentCVEP = await insertExperimentFromDataContainers(agent, cvepDataContainers, ExperimentType.CVEP);

    cvepExperiment.name = 'cvep-updated';

    const response = await agent.patch(BASE_API).send(cvepExperiment).expect(200);
    const body: ResponseObject<ExperimentCVEP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(cvepExperiment);
  });

  it('positive - should delete existing CVEP experiment', async () => {
    // načtu lokální datakontejnery
    const cvepDataContainers = await readDataContainers('experiments/cvep');
    // vložím CVEP experiment do databáze
    const cvepExperiment: ExperimentCVEP = await insertExperimentFromDataContainers(agent, cvepDataContainers, ExperimentType.CVEP);

    const response = await agent.delete(`${BASE_API}/${cvepExperiment.id}`).send().expect(200);
    const body: ResponseObject<ExperimentCVEP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(cvepExperiment);
  });

  // it('positive - should run CVEP experiment', async () => {
  //   // načtu lokální datakontejnery
  //   const cvepDataContainers = await readDataContainers('experiments/cvep');
  //   // vložím CVEP experiment do databáze
  //   const cvepExperiment: ExperimentCVEP = await insertExperimentFromDataContainers(agent, cvepDataContainers, ExperimentType.CVEP);
  // });
});
