export class ExperimentResultIdNotFoundError extends Error {
  constructor(public readonly experimentResultID: number) {
    super();
  }
  // public static withString(
  //   experimentResultID: string | number
  // ): ExperimentResultIdNotFoundError {
  //   return new ExperimentResultIdNotFoundError(
  //     `ExperimentResultID: ${experimentResultID} not found.`
  //   );
  // }
}
