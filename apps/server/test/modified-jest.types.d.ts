import {
  CvepOutput,
  ErpOutput,
  Experiment,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP,
  FvepOutput,
  Output,
  ReaOutput,
  TvepOutput,
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

declare global {
  namespace jest {
    export type ExperimentType = ExperimentCVEP | ExperimentFVEP | ExperimentTVEP | ExperimentREA | ExperimentERP;
    export type ExperimentEntityType = (ExperimentCvepEntity | ExperimentFvepEntity | ExperimentTvepEntity | ExperimentReaEntity | ExperimentErpEntity) &
      ExperimentEntity & { outputs: [] };
    export type ExperimentOutputType = CvepOutput | FvepOutput | TvepOutput | ReaOutput | ErpOutput;
    export type ExperimentOutputEntityType =
      | ExperimentCvepOutputEntity
      | ExperimentFvepOutputEntity
      | ExperimentTvepOutputEntity
      | ExperimentReaOutputEntity
      | ExperimentErpOutputEntity;

    interface Matchers<R> {
      toMatchExperiment(expected: ExperimentEntity[]): R;
      toMatchExperimentType(expected: ExperimentEntityType): R;
      toMatchExperimentOutputs(expected: ExperimentOutputEntityType[]): R;
      toMatchExperimentOutputType(expected: ExperimentOutputEntityType): R;
    }
  }
}
