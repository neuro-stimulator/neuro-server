import { SuperAgentTest } from 'supertest';

import { ExperimentResult, ResponseObject } from '@stechy1/diplomka-share';

import { ENDPOINTS, EXPERIMENT_RESULTS } from './endpoints';

const API_URL = ENDPOINTS[EXPERIMENT_RESULTS];

/**
 * Odešle požadavek na server pro získání všech výsledků experimentů
 *
 * @param agent {@link SuperAgentTest}
 */
export async function getAllExperimentResults(agent: SuperAgentTest): Promise<ExperimentResult[]> {
  const response = await agent.get(API_URL).send();
  const body: ResponseObject<ExperimentResult[]> = response.body;

  return body.data;
}
