import { Injectable, Logger } from '@nestjs/common';
import { StimulConfig } from './stimul-config';
import { Greeter } from 'diplomka-share';

@Injectable()
export class AppService {

  private static readonly STIMUL_SORTER = (a: StimulConfig, b: StimulConfig) => {
    return a.likelihood - b.likelihood;
  };

  private readonly logger = new Logger(AppService.name);

  private static xxx = Greeter('');

  private _isStimulPossibleToUse(sequence: number[], stimul: StimulConfig): boolean {
    if (stimul.dependencies === null || !(stimul.dependencies instanceof Array)) {
      return true;
    }
    const result = {};
    for (const dependency of stimul.dependencies) {
      result[dependency.stimul] = false;
      const stimulNumber = dependency.stimul;
      const occurrence = dependency.occurrence;
      const inRow = dependency.inRow;
      let count = 0;

      for (let i = sequence.length - 1; i >= 0; i--) {
        // this.logger.debug(`Kontroluji stimul: ${sequence[i]}`);
        // Pokud narazím na stimul s hodnotou dotazovaného stimulu, nemůžu ho použít
        if (sequence[i] === stimul.value) {
          // this.logger.warn('Narazil jsem na dotazovaný stimul, takže nový nemůžu použít');
          return false;
        }

        if (sequence[i] === stimulNumber) {
          // this.logger.log('Našel jsem nadějný stimul.');
          if (inRow) {
            count = 1;
            // this.logger.log('Stimul vyžaduje sekvenci stimulů v řadě.');
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
            count++;
          }
          if (occurrence === count) {
            result[dependency.stimul] = true;
            break;
          }
        }
      }

      if (result[dependency.stimul] === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Vygeneruje sekvenci stimulů
   * @param config Konfigurace stimulů
   * @param sequenceSize Celkový počet stimulů
   */
  generateSequence(config: StimulConfig[], sequenceSize: number): number[] {
    this.logger.log(config);
    config.sort(AppService.STIMUL_SORTER);
    const stimulyCount = config.length;
    const sequence = [];

    for (let i = 0; i < sequenceSize; i++) {
      // 0.5261856600802297
      const rand: number = Math.random();
      this.logger.log(rand);
      let j = 0;
      let stimul: StimulConfig = null;
      let found = false;
      for (; j < stimulyCount; j++) {
        stimul = config[j];
        if (stimul.likelihood >= rand) {
          if (this._isStimulPossibleToUse(sequence, stimul)) {
            // this.logger.verbose(`Byl nalezen stimul: ${stimul.likelihood}, který vyhovuje pravděpodobnosti: ${rand}`);
            found = true;
            break;
          }
        }
      }
      // Pokud žádný stimul nevyhovuje pravděpodobnosti, vloží se 'mezera'
      if (!found) {
        // this.logger.warn('Žádný stimul nevyhovuje pravděpodobnosti!');
        sequence.push(0);
        continue;
      }

      // Stimuly budou číslovány od 1
      // 0 = mezera
      sequence.push(stimul.value);
    }

    return sequence;
  }
}
