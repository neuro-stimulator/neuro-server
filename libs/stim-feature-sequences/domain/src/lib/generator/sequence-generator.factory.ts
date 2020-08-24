import { SequenceGenerator } from './sequence-generator';
import { RouletteWheelSequenceGenerator } from "./impl/roulette-wheel-sequence-generator";

export class SequenceGeneratorFactory {
  public createSequenceGenerator(): SequenceGenerator {
    return new RouletteWheelSequenceGenerator();
  }
}
