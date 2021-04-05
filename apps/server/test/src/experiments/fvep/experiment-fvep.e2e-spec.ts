import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { FvepOutput, Experiment, ExperimentFVEP, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentFvepEntity, ExperimentFvepOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { performLoginFromDataContainer } from '../../../helpers';

describe('Experiment FVEP', () => {
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

  it('positive - should create new FVEP experiment', async () => {
    const fvepDataContainers = await readDataContainers('experiments/fvep');
    const experiment = (fvepDataContainers[ExperimentEntity.name][0].entities[0] as unknown) as ExperimentEntity;
    const fvepPart = fvepDataContainers[ExperimentFvepEntity.name][0].entities[0] as Omit<ExperimentFVEP, keyof Experiment<FvepOutput>>;
    const fvepOutputs = (fvepDataContainers[ExperimentFvepOutputEntity.name][0].entities as unknown) as ExperimentFvepOutputEntity[];
    const fvepExperiment: jest.experiments.ExperimentEntityFullType = { ...experiment, ...fvepPart, outputs: [] };

    const response = await agent.post(BASE_API).send(fvepExperiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentFVEP> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(fvepExperiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(fvepOutputs);
  });
});
