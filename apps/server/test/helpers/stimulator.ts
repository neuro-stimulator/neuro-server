import { SuperAgentTest } from 'supertest';

import { ConnectionStatus, ResponseObject } from '@stechy1/diplomka-share';

import { StimulatorActionType, StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { ENDPOINTS, STIMULATOR } from './endpoints';

const API_URL = ENDPOINTS[STIMULATOR];

export async function getStimulatorState(agent: SuperAgentTest): Promise<ConnectionStatus> {
  const response = await agent.get(`${API_URL}/state?asyncStimulatorRequest=true`).send();
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
export async function invokeExperimentAction(agent: SuperAgentTest, action: StimulatorActionType, experimentID: number, asyncStimulatorRequest: boolean = false, force: boolean = false): Promise<StimulatorStateData | any> {
  const response = await agent.patch(`${API_URL}/experiment/${action}/${experimentID}?asyncStimulatorRequest=${asyncStimulatorRequest}&force=${force}`).send();
  const body: ResponseObject<StimulatorStateData | any> = response.body;

  return body.data;
}

/**
 * Počká požadovaný počet vteřin, pak vrátí resolved promise
 *
 * @param seconds Počet vteřin, po který se má čekat
 */
export async function letTheExperimentRunForSeconds(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}
