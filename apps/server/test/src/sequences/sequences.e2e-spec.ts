import { SuperAgentTest } from 'supertest';
import { INestApplication } from '@nestjs/common';

import { Experiment, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';
import { SequenceEntity } from '@diplomka-backend/stim-feature-sequences/domain';
import { ExperimentEntity } from '@diplomka-backend/stim-feature-experiments/domain';

import { setupFromConfigFile, tearDown } from '../../setup';
import { ENDPOINTS, SEQUENCES } from '../../helpers/endpoints';
import { performLoginFromDataContainer } from '../../helpers/auth';

describe('Sequences', () => {
  const BASE_API = `${ENDPOINTS[SEQUENCES]}`;
  const userID = 1;
  const experimentIdWithSequences = 17;
  const experimentIdWithoutSequences = 19;

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

  it('positive - should return all sequences for one user', async () => {
    const sequences: SequenceEntity[] = (dataContainers[SequenceEntity.name][0].entities as unknown as SequenceEntity[]).filter(
      (sequence: SequenceEntity) => sequence.userId == userID
    );
    const response = await agent.get(BASE_API).expect(200);
    const body: ResponseObject<Sequence[]> = response.body;

    expect(body.data).toMatchSequence(sequences);
  });

  it('positive - should return all sequences for experiment', async () => {
    const sequences: SequenceEntity[] = (dataContainers[SequenceEntity.name][0].entities as unknown as SequenceEntity[]).filter(
      (sequence: SequenceEntity) => sequence.experimentId == experimentIdWithSequences
    );

    const response = await agent.get(`${BASE_API}/for-experiment/${experimentIdWithSequences}`).send().expect(200);
    const body: ResponseObject<Sequence[]> = response.body;

    expect(body.data).toMatchSequence(sequences);
  });

  it('positive - should return experiments which supports sequences', async () => {
    const experiments: ExperimentEntity[] = (dataContainers[ExperimentEntity.name][0].entities as unknown as ExperimentEntity[]).filter(
      (experiment: ExperimentEntity) => experiment.supportSequences && experiment.userId == userID
    );

    const response = await agent.get(`${BASE_API}/experiments-as-sequence-source`).send().expect(200);
    const body: ResponseObject<Experiment<Output>[]> = response.body;

    expect(body.data).toMatchExperiment(experiments);
  });

  it('positive - should generate sequence for selected experiment', async () => {
    const sequenceSize = 50;

    const response = await agent.get(`${BASE_API}/generate/${experimentIdWithoutSequences}/${sequenceSize}`).send().expect(200);
    const body: ResponseObject<number[]> = response.body;

    expect(body.data).toHaveLength(sequenceSize);
  });
});
