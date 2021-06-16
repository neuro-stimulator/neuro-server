import { SuperAgentTest } from 'supertest';

import { ENDPOINTS, SERIAL } from './endpoints';
import { ResponseObject } from '@stechy1/diplomka-share';

const API_URL = ENDPOINTS[SERIAL];

export async function openSerialPort(agent: SuperAgentTest, path: string = 'virtual'): Promise<void> {
  const response = await agent.post(`${API_URL}/open`).send({path});
  const body: ResponseObject<void> = response.body;

  return body.data
}

export async function stopSerialPort(agent: SuperAgentTest): Promise<void> {
  const response = await agent.patch(`${API_URL}/stop`).send();
  const body: ResponseObject<void> = response.body;

  return body.data
}
