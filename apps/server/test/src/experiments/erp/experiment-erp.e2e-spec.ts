import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { ErpOutput, Experiment, ExperimentERP, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentErpEntity, ExperimentErpOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { performLoginFromDataContainer } from '../../../helpers';

describe('Experiment ERP', () => {
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

  it('positive - should create new ERP experiment', async () => {
    const erpDataContainers = await readDataContainers('experiments/erp');
    const experiment = (erpDataContainers[ExperimentEntity.name][0].entities[0] as unknown) as ExperimentEntity;
    const erpPart = erpDataContainers[ExperimentErpEntity.name][0].entities[0] as Omit<ExperimentERP, keyof Experiment<ErpOutput>>;
    const erpOutputs = (erpDataContainers[ExperimentErpOutputEntity.name][0].entities as unknown) as ExperimentErpOutputEntity[];
    const erpExperiment: jest.ExperimentEntityType = { ...experiment, ...erpPart, outputs: [] };

    const response = await agent.post(BASE_API).send(erpExperiment).expect(201);
    const responseExperiment: ResponseObject<ExperimentERP> = response.body;

    expect(responseExperiment.data).toMatchExperimentType(erpExperiment);
    expect(responseExperiment.data.outputs).toMatchExperimentOutputs(erpOutputs);
  });
});
