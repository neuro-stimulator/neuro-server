import {
  CvepOutput,
  ErpOutput,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentResult,
  ExperimentTVEP,
  FvepOutput,
  ReaOutput,
  TvepOutput
} from '@stechy1/diplomka-share';
import {
  ExperimentCvepEntity,
  ExperimentCvepOutputEntity,
  ExperimentEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentReaEntity,
  ExperimentReaOutputEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
} from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentResultEntity } from '@diplomka-backend/stim-feature-experiment-results/domain';

declare global {
  namespace jest {
    namespace experiments {
      export type ExperimentType = ExperimentCVEP | ExperimentFVEP | ExperimentTVEP | ExperimentREA | ExperimentERP;
      export type ExperimentEntityType = ExperimentCvepEntity | ExperimentFvepEntity | ExperimentTvepEntity | ExperimentReaEntity | ExperimentErpEntity;
      export type ExperimentEntityFullType = (ExperimentCvepEntity | ExperimentFvepEntity | ExperimentTvepEntity | ExperimentReaEntity | ExperimentErpEntity) &
        ExperimentEntity & { outputs: [] };
      export type ExperimentOutputType = CvepOutput | FvepOutput | TvepOutput | ReaOutput | ErpOutput;
      export type ExperimentOutputEntityType =
        | ExperimentCvepOutputEntity
        | ExperimentFvepOutputEntity
        | ExperimentTvepOutputEntity
        | ExperimentReaOutputEntity
        | ExperimentErpOutputEntity;
    }

    namespace experimentResults {
      export type ExperimentResultType = Omit<ExperimentResult, 'date' | 'filename'>;
      export type ExperimentResultEntityType = ExperimentResultEntity;
    }

    interface Matchers<R> {
      toMatchExperiment(expected: ExperimentEntity[]): R;
      toMatchExperimentType(expected: experiments.ExperimentEntityFullType): R;
      toMatchExperimentOutputs(expected: experiments.ExperimentOutputEntityType[]): R;
      toMatchExperimentOutputType(expected: experiments.ExperimentOutputEntityType): R;
      toMatchExperimentResult(expected: ExperimentResultEntity[]): R;
      toMatchExperimentResultType(expected: experimentResults.ExperimentResultType): R;
    }
  }
}
