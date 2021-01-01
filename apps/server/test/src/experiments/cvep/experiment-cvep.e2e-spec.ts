import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { CvepOutput, Experiment, ExperimentCVEP, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentCvepEntity, ExperimentCvepOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { performLoginFromDataContainer } from '../../../helpers';

describe('Experiment CVEP', () => {
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

  it('positive - should create new CVEP experiment', async () => {
    const cvepDataContainers = await readDataContainers('experiments/cvep');
    const experiment = (cvepDataContainers[ExperimentEntity.name][0].entities[0] as unknown) as ExperimentEntity;
    const cvepPart = cvepDataContainers[ExperimentCvepEntity.name][0].entities[0] as Omit<ExperimentCVEP, keyof Experiment<CvepOutput>>;
    const cvepOutputs = (cvepDataContainers[ExperimentCvepOutputEntity.name][0].entities as unknown) as ExperimentCvepOutputEntity[];
    const cvepExperiment: jest.ExperimentEntityType = { ...experiment, ...cvepPart, outputs: [] };

    const response = await agent.post(BASE_API).send(cvepExperiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentCVEP> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(cvepExperiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(cvepOutputs);
  });
});
