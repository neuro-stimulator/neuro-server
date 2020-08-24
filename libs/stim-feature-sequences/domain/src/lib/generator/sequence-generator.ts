import { ExperimentSupportSequences } from '@stechy1/diplomka-share';

export interface SequenceGenerator {
  /**
   * Název generátoru
   */
  name: string;

  /**
   * Vytvoří novou požadovanou sekvenci pomocí vybrané metody
   *
   * @param experiment Experiment, pro který se sekvence generuje
   * @param sequenceSize Délka sekvence
   */
  generate(experiment: ExperimentSupportSequences, sequenceSize: number): number[];
}
