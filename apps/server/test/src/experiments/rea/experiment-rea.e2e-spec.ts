import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ReaOutput, Experiment, ExperimentREA, ResponseObject, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentReaEntity, ExperimentReaOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { insertExperimentFromDataContainers, performLoginFromDataContainer } from '../../../helpers';

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

  it('positive - should update existing REA experiment', async () => {
    // načtu lokální datakontejnery
    const reaDataContainers = await readDataContainers('experiments/rea');
    // vložím REA experiment do databáze
    const reaExperiment: ExperimentREA = await insertExperimentFromDataContainers(agent, reaDataContainers, ExperimentType.REA);

    reaExperiment.name = 'rea-updated';

    const response = await agent.patch(BASE_API).send(reaExperiment).expect(200);
    const body: ResponseObject<ExperimentREA> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(reaExperiment);
  });

  it('positive - should delete existing REA experiment', async () => {
    // načtu lokální datakontejnery
    const reaDataContainers = await readDataContainers('experiments/rea');
    // vložím REA experiment do databáze
    const reaExperiment: ExperimentREA = await insertExperimentFromDataContainers(agent, reaDataContainers, ExperimentType.REA);

    const response = await agent.delete(`${BASE_API}/${reaExperiment.id}`).send().expect(200);
    const body: ResponseObject<ExperimentREA> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(reaExperiment);
  });
});
