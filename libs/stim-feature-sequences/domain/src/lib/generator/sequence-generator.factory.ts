import { RouletteWheelSequenceGenerator } from './impl/roulette-wheel-sequence-generator';
import { SequenceGenerator } from './sequence-generator';

export class SequenceGeneratorFactory {
  public createSequenceGenerator(name: string = RouletteWheelSequenceGenerator.name): SequenceGenerator {
    switch (name) {
      case RouletteWheelSequenceGenerator.name:
        return new RouletteWheelSequenceGenerator();
      default:
        return new RouletteWheelSequenceGenerator();
    }
  }
}
