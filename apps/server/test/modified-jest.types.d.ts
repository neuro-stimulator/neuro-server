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
  ReaOutput, Sequence,
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
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { SequenceEntity } from '@diplomka-backend/stim-feature-sequences/domain';

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

    namespace sequences {
      export type SequenceType = Sequence;
      export type SequenceEntityType = SequenceEntity;
    }

    namespace stimulator {
      export type StimulatorStateDataType = StimulatorStateData;
      export type StimulatorStateDataValues = Omit<StimulatorStateData, 'timestamp' | 'name'> ;
    }

    interface Matchers<R> {
      toMatchExperiment(expected: ExperimentEntity[]): R;
      toMatchExperimentType(expected: experiments.ExperimentEntityFullType): R;
      toMatchExperimentOutputs(expected: experiments.ExperimentOutputEntityType[]): R;
      toMatchExperimentOutputType(expected: experiments.ExperimentOutputEntityType): R;
      toMatchExperimentResult(expected: ExperimentResultEntity[]): R;
      toMatchExperimentResultType(expected: experimentResults.ExperimentResultType): R;
      toMatchStimulatorStateType(expected: stimulator.StimulatorStateDataValues): R;
      toMatchSequence(expected: SequenceEntity[]): R;
      toMatchSequenceType(expected: sequences.SequenceType): R;
    }
  }

  namespace NodeJS {
    interface Global {
      /**
       * Proměnná slouží pouze pro uchování názvu vygenerovaných výsledků experimentů
       * Na konci každého e2e testu se data smažou
       */
      markedExperimentResultData: string[];
    }
  }

}
