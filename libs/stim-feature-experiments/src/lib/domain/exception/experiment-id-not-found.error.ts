export class ExperimentIdNotFoundError extends Error {
  public static withString(
    experimentID: string | number
  ): ExperimentIdNotFoundError {
    return new ExperimentIdNotFoundError(
      `ExperimentID: ${experimentID} not found.`
    );
  }
}
