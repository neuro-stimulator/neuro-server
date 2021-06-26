import { SuperAgentTest } from 'supertest';

import { ConnectionStatus, ResponseObject } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { ENDPOINTS, STIMULATOR } from './endpoints';

const API_URL = ENDPOINTS[STIMULATOR];

export async function getStimulatorState(agent: SuperAgentTest): Promise<ConnectionStatus> {
  const response = await agent.get(`${API_URL}/state?asyncStimulatorRequest=true`).send();
  const responseBody: ResponseObject<StimulatorStateData> = response.body;
  const stimulatorState: StimulatorStateData = responseBody.data;

  return stimulatorState.state;
}
