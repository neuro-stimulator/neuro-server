export class UnsupportedStimulatorCommandException extends Error {
  constructor(public readonly buffer: Buffer) {
    super();
  }
}
