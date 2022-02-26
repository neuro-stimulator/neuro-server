import { SuperAgentTest } from 'supertest';

import { INestApplication } from '@nestjs/common';

import { CommandToStimulator, ResponseObject } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { closeSerialPort, openSerialPort } from '../../helpers';
import { ENDPOINTS, STIMULATOR } from '../../helpers/endpoints';
import { setupFromConfigFile, tearDown } from '../../setup';

describe('Stimulator', () => {
  const BASE_API = ENDPOINTS[STIMULATOR];

  let app: INestApplication;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    [app, agent] = await setupFromConfigFile(__dirname, 'config.json');
  });

  afterEach(async () => {
    await tearDown(app);
  });

  it('stimulatorState()', async () => {
    await openSerialPort(agent);

    const response = await agent.get(`${BASE_API}/state?asyncStimulatorRequest=true`).send().expect(200);
    const responseBody: ResponseObject<StimulatorStateData> = response.body;
    const stimulatorState: StimulatorStateData = responseBody.data;

    await closeSerialPort(agent);

    expect(stimulatorState).toBeDefined();
    expect(stimulatorState.state).toEqual(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_READY);
  });
});
