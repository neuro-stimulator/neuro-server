import { SuperAgentTest } from 'supertest';

import { ConnectionStatus, ResponseObject } from '@stechy1/diplomka-share';

import { ENDPOINTS, SERIAL } from './endpoints';

const API_URL = ENDPOINTS[SERIAL];

/**
 * Odešle na server požadavek pro získání stavu spojení sériové linky
 *
 * @param agent {@link SuperAgentTest}
 * @return {@link ConnectionStatus} Stav spojení sériové linky
 */
export async function getSerialConnectionStatus(agent: SuperAgentTest): Promise<ConnectionStatus> {
  const response = await agent.get(`${API_URL}/status`).send();
  const body: ResponseObject<{ status: ConnectionStatus }> = response.body;

  return body.data.status;
}

/**
 * Odešle na server požadavek s otevřením sériového portu se zadanou cestou
 *
 * @param agent {@link SuperAgentTest}
 * @param path Cesta k sériovému portu
 */
export async function openSerialPort(agent: SuperAgentTest, path = 'virtual'): Promise<void> {
  await agent.post(`${API_URL}/open`).send({ path });
}

/**
 * Odešle na server požadavek s uzavřením sériového portu.
 *
 * @param agent {@link SuperAgentTest}
 */
export async function closeSerialPort(agent: SuperAgentTest): Promise<void> {
  await agent.patch(`${API_URL}/stop`).send();
}
