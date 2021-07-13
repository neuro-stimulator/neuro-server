import { Injectable } from '@nestjs/common';

import { Experiment, ExperimentCVEP, ExperimentERP, ExperimentFVEP, ExperimentREA, ExperimentTVEP, ExperimentType, Output } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment/experiment.protocol';
import { ExperimentErpProtocol } from './experiment/experiment-erp.protocol';
import { ExperimentCvepProtocol } from './experiment/experiment-cvep.protocol';
import { ExperimentFvepProtocol } from './experiment/experiment-fvep.protocol';
import { ExperimentTvepProtocol } from './experiment/experiment-tvep.protocol';
import { ExperimentReaProtocol } from './experiment/experiment-rea.protocol';

@Injectable()
export class ExperimentProtocolCodec {

  /**
   * Zakóduje experiment do packetu pro nahrání do stimulátoru
   *
   * @param experiment Experiment
   * @param commandID Číslo příkazu
   * @param sequenceSize Pokud experiment podporuje sekvence, dostane i její délku
   */
  public encodeExperiment(experiment: Experiment<Output>, commandID: number, sequenceSize?: number): Buffer {
    return this.experimentProtocolForType(experiment.type, experiment).encodeExperiment(commandID, sequenceSize);
  }

  public decodeExperiment<T extends Experiment<Output>>(buffer: Buffer): T {
    const experimentType: ExperimentType = this.getExperimentTypeFromBuffer(buffer);
    const experimentProtocol: ExperimentProtocol = this.experimentProtocolForType(experimentType);

    return experimentProtocol.decodeExperiment(buffer);
  }

  /**
   * Dekóduje typ experimentu z bufferu
   *
   * @param buffer Buffer se zakódovaným experimentem
   */
  protected getExperimentTypeFromBuffer(buffer: Buffer): ExperimentType {
    // Přeskočím commandID, typ a třídu packetu
    const offset = 3;
    // Přečtu 1. parametr příkazu = typ experimentu
    return buffer.readUInt8(offset);
  }

  /**
   * Na základě typu experimentu vrátí příslušnou implementaci
   *
   * @param experimentType Typ experimentu
   * @param experiment Optional parameter experimentu, který se vloží do konstruktoru implementace protokolu
   */
  protected experimentProtocolForType(experimentType: ExperimentType, experiment?: Experiment<Output>): ExperimentProtocol {
    switch (experimentType) {
      case ExperimentType.ERP:
        return new ExperimentErpProtocol(experiment as ExperimentERP);
      case ExperimentType.CVEP:
        return new ExperimentCvepProtocol(experiment as ExperimentCVEP);
      case ExperimentType.FVEP:
        return new ExperimentFvepProtocol(experiment as ExperimentFVEP);
      case ExperimentType.TVEP:
        return new ExperimentTvepProtocol(experiment as ExperimentTVEP);
      case ExperimentType.REA:
        return new ExperimentReaProtocol(experiment as ExperimentREA);
      default:
        throw new Error('Experiment type not supported');
    }
  }
}
