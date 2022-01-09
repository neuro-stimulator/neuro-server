import { SuperAgentTest } from 'supertest';

import { ConnectionStatus, ResponseObject } from '@stechy1/diplomka-share';

import { StimulatorActionType, StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { ENDPOINTS, STIMULATOR } from './endpoints';

const API_URL = ENDPOINTS[STIMULATOR];

/**
 * Odešle požadavek na server pro získání aktuálního stavu stimulátoru
 *
 * @param agent {@link SuperAgentTest}
 * @param async True, pokud se jedná o asynchronní akci (default=true)
 */
export async function getStimulatorState(agent: SuperAgentTest, async = true): Promise<ConnectionStatus> {
  const response = await agent.get(`${API_URL}/state?asyncStimulatorRequest=${async}`).send();
  const responseBody: ResponseObject<StimulatorStateData> = response.body;
  const stimulatorState: StimulatorStateData = responseBody.data;

  return stimulatorState.state;
}

/**
 * Odešle požadavek na server se spuštěním požadované akce na stimulátoru.
 *
 * @param agent {@link SuperAgentTest}
 * @param action Akce, která se má provést
 * @param experimentID ID experimentu, pro který se má akce provést
 * @param asyncStimulatorRequest True, pokud se jedná o asynchronní akci (default=false)
 * @param force True, pokud se má akce vynutit (default=false) - funguje pouze pro dokončení experimentu
 */
export async function invokeExperimentAction(
  agent: SuperAgentTest,
  action: StimulatorActionType,
  experimentID: number,
  asyncStimulatorRequest = false,
  force = false
): Promise<StimulatorStateData | unknown> {
  const response = await agent.patch(`${API_URL}/experiment/${action}/${experimentID}?asyncStimulatorRequest=${asyncStimulatorRequest}&force=${force}`).send();
  const body: ResponseObject<StimulatorStateData | unknown> = response.body;

  return body.data;
}
