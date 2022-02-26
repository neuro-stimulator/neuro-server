import { SuperAgentTest } from 'supertest';

import { INestApplication } from '@nestjs/common';

import { ErpOutput, Experiment, ExperimentERP, ExperimentType, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentErpEntity, ExperimentErpOutputEntity, ExperimentEntity } from '@neuro-server/stim-feature-experiments/domain';
import { DataContainers } from '@neuro-server/stim-feature-seed/domain';

import { insertExperimentFromDataContainers, performLoginFromDataContainer } from '../../../helpers';
import { ENDPOINTS, EXPERIMENTS } from '../../../helpers/endpoints';
import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';

describe('Experiment ERP', () => {
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

  it('positive - should create new ERP experiment', async () => {
    const erpDataContainers = await readDataContainers('experiments/erp');
    const experiment = (erpDataContainers[ExperimentEntity.name][0].entities[0] as unknown) as ExperimentEntity;
    const erpPart = erpDataContainers[ExperimentErpEntity.name][0].entities[0] as Omit<ExperimentERP, keyof Experiment<ErpOutput>>;
    const erpOutputs = (erpDataContainers[ExperimentErpOutputEntity.name][0].entities as unknown) as ExperimentErpOutputEntity[];
    const erpExperiment: jest.experiments.ExperimentEntityFullType = { ...experiment, ...erpPart, outputs: [] };

    const response = await agent.post(BASE_API).send(erpExperiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentERP> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(erpExperiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(erpOutputs);
  });

  it('positive - should update existing ERP experiment', async () => {
    // načtu lokální datakontejnery
    const erpDataContainers = await readDataContainers('experiments/erp');
    // vložím ERP experiment do databáze
    const erpExperiment: ExperimentERP = await insertExperimentFromDataContainers(agent, erpDataContainers, ExperimentType.ERP);

    erpExperiment.name = 'erp-updated';

    const response = await agent.patch(BASE_API).send(erpExperiment).expect(200);
    const body: ResponseObject<ExperimentERP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(erpExperiment);
  });

  it('positive - should delete existing ERP experiment', async () => {
    // načtu lokální datakontejnery
    const erpDataContainers = await readDataContainers('experiments/erp');
    // vložím ERP experiment do databáze
    const erpExperiment: ExperimentERP = await insertExperimentFromDataContainers(agent, erpDataContainers, ExperimentType.ERP);

    const response = await agent.delete(`${BASE_API}/${erpExperiment.id}`).send().expect(200);
    const body: ResponseObject<ExperimentERP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(erpExperiment);
  });
});
