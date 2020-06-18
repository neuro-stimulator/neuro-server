export class ExperimentDoNotSupportSequencesError extends Error {
  constructor(public readonly experimentID: number) {
    super();
  }
}
