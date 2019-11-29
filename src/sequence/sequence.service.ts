import { ExperimentERP, ErpOutput} from 'diplomka-share';
import { StimulConfig } from '../stimul-config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SequenceService {

  private readonly logger: Logger = new Logger(SequenceService.name);

  constructor() {}

  private _isStimulPossibleToUse(sequence: number[], stimul: ErpOutput, value: number): boolean {
    if (stimul.dependencies === null || !(stimul.dependencies[0] instanceof Array) || (stimul.dependencies[0].length === 0)) {
      return true;
    }
    const result = {};
    this.logger.debug(`Budu testovat všechny závislosti ${value}. stimulu.`);
    for (const dependency of stimul.dependencies[0]) {
      result[dependency.destOutput] = false;
      const stimulNumber = dependency.destOutput;
      this.logger.debug(`Testuji závislost se stimulem: ${stimulNumber}.`);
      const occurrence = dependency.count;
      const inRow = false; // dependency.inRow;
      let count = 0;

      for (let i = sequence.length - 1; i >= 0; i--) {
        // Pokud narazím na stimul s hodnotou dotazovaného stimulu, nemůžu ho použít
        if (sequence[i] === value) {
          this.logger.warn('Narazil jsem na dotazovaný stimul, takže nový nemůžu použít');
          return false;
        }

        if (sequence[i] === stimulNumber) {
          if (inRow) {
            count = 1;
            for (let j = i - 1; j >= 0; j--) {
              if (sequence[j] !== stimulNumber) {
                return false;
              } else {
                count++;
                if (occurrence === count) {
                  break;
                }
              }
            }
          } else {
            this.logger.verbose('Našel jsem závislý stimul.');
            count++;
          }
          if (occurrence === count) {
            result[dependency.destOutput] = true;
            break;
          }
        }
      }

      if (result[dependency.destOutput] === false) {
        return false;
      }
    }

    return true;
  }

  private _analyseSequence(sequence: number[]) {
    const map = {};
    for (const value of sequence) {
      if (map[value] === undefined) {
        map[value] = {};
        map[value]['value'] = 1;
      } else {
        map[value]['value']++;
      }
    }

    for (const key of Object.keys(map)) {
      map[key]['percent'] = map[key]['value'] / sequence.length;
    }

    return map;
  }

  public async newErpSequence(experiment: ExperimentERP, sequenceSize: number, progressCallback?: (progress: number) => void) {
    this.logger.log(`Budu vytvářet novou sequenci pro ERP experiment s délkou: ${sequenceSize}`);
    const stimulyCount = experiment.outputCount;
    const sequence = [];
    const pow = Math.pow(2, 32);
    const distributions: {from: number, to: number}[] = [];
    distributions.push({from: 0, to: experiment.outputs[0].distribution});
    for (let i = 1; i < experiment.outputCount; i++) {
      const distribution = {from: distributions[i - 1].to, to: distributions[i - 1].to + experiment.outputs[i].distribution};
      distributions.push(distribution);
    }
    let value = 0;
    let seed = Date.now();

    this.logger.debug(distributions);

    for (let i = 0; i < sequenceSize; i++) {
      // const rand: number = (10000 * Math.random() + 73) % 100;
      seed = ((1103515245 * seed) + 9343) % pow;
      const rand = seed % 100;
      this.logger.debug(`Generuji ${i}. stimul s ruletovým výsledkem: ${rand}`);
      let j = 0;
      let stimul: ErpOutput = null;
      let found = false;
      value = 0;

      for (; j < stimulyCount; j++) {
        stimul = experiment.outputs[j];
        this.logger.verbose(`Distribuce v intervalu: <${distributions[j].from};${distributions[j].to})`);
        if (rand >= distributions[j].from && rand < distributions[j].to   /*stimul.distribution < rand*/) {
          if (this._isStimulPossibleToUse(sequence, stimul, j + 1)) {
            this.logger.debug(`Chytil se výstup na indexu: ${j + 1}.`);
            found = true;
            value = j + 1;
            break;
          }
        }
      }

      if (!found) {
        this.logger.warn('Nebyla nalezená žádná vhodná kombinace pro stimuly.');
      }
      sequence.push(value);
      if (found) {
        sequence.push(0);
        i++;
      }

      if (progressCallback !== undefined) {
        if ((i % 10) === 0) {
          progressCallback((i / 10));
        }
      }
    }

    progressCallback(100);

    return [sequence, this._analyseSequence(sequence)];
  }

}
