import { QueryError } from '../model/query-error';

export class ExperimentResultWasNotInitializedError extends Error {
  constructor(experimentID: number, error?: QueryError) {
    super();
  }
}
