export class UnknownStimulatorActionTypeException extends Error {
  constructor(public readonly action: string) {
    super();
  }
}
