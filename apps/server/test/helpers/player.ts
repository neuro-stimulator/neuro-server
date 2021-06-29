import { SuperAgentTest } from 'supertest';

import { ExperimentResult, PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { ENDPOINTS, PLAYER } from './endpoints';

const API_URL = ENDPOINTS[PLAYER];

/**
 * Vrátí aktuální stav přehrávače
 *
 * @param agent {@link SuperAgentTest}
 */
export async function getPlayerStatus(agent: SuperAgentTest): Promise<PlayerConfiguration> {
  const response = await agent.get(`${API_URL}/state`).send();
  const body: ResponseObject<PlayerConfiguration> = response.body;

  return body.data;
}

/**
 * Inicializuje přehrávač experimentů
 *
 * @param agent {@link SuperAgentTest}
 * @param config Konfigurace přehrávače
 * @param experimentID ID experimentu, pro který se má přehrávač připravit
 * @return ExperimentResult Inicializovaný výsledek experimentu
 */
export async function preparePlayer(agent: SuperAgentTest, config: PlayerConfiguration, experimentID: number): Promise<ExperimentResult> {
  const response = await agent.post(`${API_URL}/prepare/${experimentID}`).send(config);
  const body: ResponseObject<ExperimentResult> = response.body;

  return body.data;
}
