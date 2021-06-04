import { Type } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';

import { Experiment, ExperimentType, Output, ResponseObject } from '@stechy1/diplomka-share';

import {
  ExperimentCvepEntity,
  ExperimentCvepOutputEntity,
  ExperimentEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentReaEntity,
  ExperimentReaOutputEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
} from '@diplomka-backend/stim-feature-experiments/domain';
import { DataContainers } from '@diplomka-backend/stim-feature-seed/domain';

import { ENDPOINTS, EXPERIMENTS } from './endpoints';

const API_URL = `${ENDPOINTS[EXPERIMENTS]}`;

const experimentTypeEntityMap: Record<number, { experiment: Type; output: Type }> = {};
experimentTypeEntityMap[ExperimentType.ERP] = { experiment: ExperimentErpEntity, output: ExperimentErpOutputEntity };
experimentTypeEntityMap[ExperimentType.CVEP] = { experiment: ExperimentCvepEntity, output: ExperimentCvepOutputEntity };
experimentTypeEntityMap[ExperimentType.FVEP] = { experiment: ExperimentFvepEntity, output: ExperimentFvepOutputEntity };
experimentTypeEntityMap[ExperimentType.TVEP] = { experiment: ExperimentTvepEntity, output: ExperimentTvepOutputEntity };
experimentTypeEntityMap[ExperimentType.REA] = { experiment: ExperimentReaEntity, output: ExperimentReaOutputEntity };

/**
 * Extrahuje experiment z datakontejneru
 *
 * @param dataContainers Datakontejnery s experimentem
 * @param experimentType Typ experimentu, který se bude extrahovat
 * @param experimentBaseIndex Index, na kterém se nachází parametry base části experimentu. Výchozí hodnota = 0
 * @param experimentTypePartIndex Index, na kterém se nachází parametry typové části experimentu. Výchozí hodnota = 0
 * @param outputIndex Index, na kterém se nachází výstupy experimentu. Výchozí hodnota = 0
 * @return \{ experimentBase: {@link ExperimentEntity}, experimentTypePart: {@link jest.experiments.ExperimentEntityType}, experiment: {@link jest.experiments.ExperimentType}, outputs: {@link jest.experiments.ExperimentOutputEntityType[]} \}
 */
export function extractExperimentFromDataContainers(
  dataContainers: DataContainers,
  experimentType: ExperimentType,
  experimentBaseIndex = 0,
  experimentTypePartIndex = 0,
  outputIndex = 0
): {
  experimentBase: ExperimentEntity;
  experimentTypePart: jest.experiments.ExperimentEntityType;
  experiment: jest.experiments.ExperimentEntityFullType;
  outputs: jest.experiments.ExperimentOutputEntityType[];
} {
  const experimentBase = (dataContainers[ExperimentEntity.name][0].entities[experimentBaseIndex] as unknown) as ExperimentEntity;
  const experimentTypePart = (dataContainers[experimentTypeEntityMap[experimentType].experiment.name][0].entities[
    experimentTypePartIndex
  ] as unknown) as jest.experiments.ExperimentEntityType;
  const outputs = (dataContainers[experimentTypeEntityMap[experimentType].output.name][0].entities as unknown) as jest.experiments.ExperimentOutputEntityType[];
  const experiment = ({ ...experimentBase, ...experimentTypePart, outputs: [] } as unknown) as jest.experiments.ExperimentEntityFullType;

  return { experiment, experimentBase, experimentTypePart, outputs };
}

/**
 * Odešle požadavek na server s vložením experimentu do databáze.
 * Experiment bude automaticky vyextrahován z datakontejnerů
 *
 * @param agent Agent udržující session
 * @param dataContainers Datakontejnery s experimentem
 * @param experimentType Typ experimentu, který se bude vkládat
 * @param experimentBaseIndex Index, na kterém se nachází parametry base části experimentu. Výchozí hodnota = 0
 * @param experimentTypePartIndex Index, na kterém se nachází parametry typové části experimentu. Výchozí hodnota = 0
 */
export async function insertExperimentFromDataContainers<T extends Experiment<Output>>(
  agent: SuperAgentTest,
  dataContainers: DataContainers,
  experimentType: ExperimentType,
  experimentBaseIndex = 0,
  experimentTypePartIndex = 0
): Promise<T | undefined> {
  const { experiment } = extractExperimentFromDataContainers(dataContainers, experimentType, experimentBaseIndex, experimentTypePartIndex);

  return insertExperiment(agent, experiment);
}

/**
 * Odešle požadavek na server s vložením experimentu do databáze
 *
 * @param agent Agent udržující session
 * @param experiment Experiment, který se má vložit do databáze
 */
export async function insertExperiment<T>(agent: SuperAgentTest, experiment: jest.experiments.ExperimentEntityFullType): Promise<T | undefined> {
  const response = await agent.post(API_URL).send(experiment);
  const body: ResponseObject<T> = response.body;

  return body.data;
}
