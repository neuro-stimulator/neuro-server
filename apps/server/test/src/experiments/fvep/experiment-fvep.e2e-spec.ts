import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { FvepOutput, Experiment, ExperimentFVEP, ResponseObject, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentFvepEntity, ExperimentFvepOutputEntity, ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { readDataContainers, setupFromConfigFile, tearDown } from '../../../setup';
import { insertExperimentFromDataContainers, performLoginFromDataContainer } from '../../../helpers';
import { ENDPOINTS, EXPERIMENTS } from '../../../helpers/endpoints';

describe('Experiment FVEP', () => {
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

  it('positive - should update existing FVEP experiment', async () => {
    // načtu lokální datakontejnery
    const fvepDataContainers = await readDataContainers('experiments/fvep');
    // vložím FVEP experiment do databáze
    const fvepExperiment: ExperimentFVEP = await insertExperimentFromDataContainers(agent, fvepDataContainers, ExperimentType.FVEP);

    fvepExperiment.name = 'fvep-updated';

    const response = await agent.patch(BASE_API).send(fvepExperiment).expect(200);
    const body: ResponseObject<ExperimentFVEP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(fvepExperiment);
  });

  it('positive - should delete existing FVEP experiment', async () => {
    // načtu lokální datakontejnery
    const fvepDataContainers = await readDataContainers('experiments/fvep');
    // vložím FVEP experiment do databáze
    const fvepExperiment: ExperimentFVEP = await insertExperimentFromDataContainers(agent, fvepDataContainers, ExperimentType.FVEP);

    const response = await agent.delete(`${BASE_API}/${fvepExperiment.id}`).send().expect(200);
    const body: ResponseObject<ExperimentFVEP> = response.body;
    const updatedCvepExperiment = body.data;

    expect(updatedCvepExperiment).toEqual(fvepExperiment);
  });
});
