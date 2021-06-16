import { SuperAgentTest } from 'supertest';

import { PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { ENDPOINTS, PLAYER } from './endpoints';

const API_URL = ENDPOINTS[PLAYER];

export async function getPlayerStatus(agent: SuperAgentTest): Promise<PlayerConfiguration> {
  const response = await agent.get(`${API_URL}/state`).send();
  const body: ResponseObject<PlayerConfiguration> = response.body;

  return body.data;
}
