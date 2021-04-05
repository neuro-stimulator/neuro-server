import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ReaOutput, Experiment, ExperimentREA, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentReaEntity, ExperimentReaOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { performLoginFromDataContainer } from '../../../helpers';

describe('Experiment REA', () => {
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

  it('positive - should create new REA experiment', async () => {
    const reaDataContainers = await readDataContainers('experiments/rea');
    const experiment = (reaDataContainers[ExperimentEntity.name][0].entities[0] as unknown) as ExperimentEntity;
    const reaPart = reaDataContainers[ExperimentReaEntity.name][0].entities[0] as Omit<ExperimentREA, keyof Experiment<ReaOutput>>;
    const reaOutputs = (reaDataContainers[ExperimentReaOutputEntity.name][0].entities as unknown) as ExperimentReaOutputEntity[];
    const reaExperiment: jest.experiments.ExperimentEntityFullType = { ...experiment, ...reaPart, outputs: [] };

    const response = await agent.post(BASE_API).send(reaExperiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentREA> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(reaExperiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(reaOutputs);
  });
});
