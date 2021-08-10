import { SuperAgentTest } from 'supertest';

import { INestApplication } from '@nestjs/common';

import { CommandFromStimulator, Experiment, ExperimentResult, ExperimentType, Output, PlayerConfiguration } from '@stechy1/diplomka-share';

import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import {
  performLoginFromDataContainer,
  performLogout,
  getAllExperiments,
  getAllExperimentResults,
  groupBy,
  getPlayerStatus,
  preparePlayer,
  closeSerialPort,
  openSerialPort,
  invokeExperimentAction,
  letTheExperimentRunForSeconds, validExperimentTypes, markCreatedExperimentResultData
} from '../helpers';
import { setupFromConfigFile, tearDown } from '../setup';

describe('Server test', () => {
  const userID = 1;

  let app: INestApplication;
  let agent: SuperAgentTest;
  let dataContainers: DataContainers;

  let experiments: Experiment<Output>[];
  let experimentGroups: Record<string, Experiment<Output>[]> = {};

  beforeEach(async () => {
    // spuštění serveru
    [app, agent, dataContainers] = await setupFromConfigFile(__dirname, 'config.json');
    // Přihlásím uživatele
    await performLoginFromDataContainer(agent, dataContainers, userID);

    // Načtu experimenty
    experiments = await getAllExperiments(agent);
    // Rozdělím je do skupin podle typu experimentu
    experimentGroups = groupBy(experiments, (e: Experiment<Output>) => ExperimentType[e.type]);

    // Otevřu sériový port
    await openSerialPort(agent);
  });

  afterEach(async () => {
    // Zavřu sériový port
    await closeSerialPort(agent);
    // Odhlásím uživatele
    await performLogout(agent);
    // Ukončím aplikaci
    await tearDown(app);
  });


  test.each(validExperimentTypes)('positive - should do one experiment for type: %s', async (experimentType: string) => {
    const experiment: Experiment<Output> = experimentGroups[experimentType][0];
    const experimentID = experiment.id;

    // Nejdříve získám stav přehrávače
    let playerStatus: PlayerConfiguration = await getPlayerStatus(agent);
    // A ujistím se, že není inicializovaný
    expect(playerStatus.initialized).toBeFalsy();

    // Inicializuje přehrávač
    const experimentResult: ExperimentResult = await preparePlayer(agent, playerStatus, experimentID);

    // Znovu získám stav přehrávače
    playerStatus = await getPlayerStatus(agent);
    // A ujistím se, že už je inicializovaný
    expect(playerStatus.initialized).toBeTruthy();

    // Testování stavů experimentu

    let response = await invokeExperimentAction(agent, 'upload', experimentID, true);
    expect(response).toMatchStimulatorStateType({
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_UPLOADED,
      noUpdate: false
    });

    response = await invokeExperimentAction(agent, 'setup', experimentID, true);
    expect(response).toMatchStimulatorStateType({
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED,
      noUpdate: false
    });

    response = await invokeExperimentAction(agent, 'run', experimentID, true);
    expect(response).toMatchStimulatorStateType({
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING,
      noUpdate: false
    });

    // Nechám experiment běžet 5 vteřin, aby se vygenerovala nějaká data
    await letTheExperimentRunForSeconds(5);

    response = await invokeExperimentAction(agent, 'finish', experimentID, true);
    expect(response).toMatchStimulatorStateType({
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED,
      noUpdate: false
    });

    // Konec testování stavu experimentu

    // Znovu získám stav přehrávače
    playerStatus = await getPlayerStatus(agent);
    // A ujistím se, že už není inicializovaný
    expect(playerStatus.initialized).toBeFalsy();

    // Získám všechny výsledky experimentů
    const allExperimentResults: ExperimentResult[] = await getAllExperimentResults(agent);
    // Ujistím se, že je pouze jeden výsledek experimentu
    expect(allExperimentResults).toHaveLength(1);
    // Vytáhnu si výsledek experimentu z pole
    const createdExperimentResult: ExperimentResult = allExperimentResults[0];
    // Ověřím si, že výsledek experimentu odpovídá údajům vygenerovaným při inicializaci přehrávače
    expect(createdExperimentResult).toMatchExperimentResultType(experimentResult);
    // Označím vytvořená data výsledku experimentu ke smazání
    markCreatedExperimentResultData(createdExperimentResult.filename);
  });
});
