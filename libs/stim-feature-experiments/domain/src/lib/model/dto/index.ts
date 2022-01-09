import { ExperimentType } from '@stechy1/diplomka-share';

import { DTO } from '@neuro-server/stim-lib-dto';

import { ExperimentCvepDTO } from './experiment-cvep.dto';
import { ExperimentErpDTO } from './experiment-erp.dto';
import { ExperimentFvepDTO } from './experiment-fvep.dto';
import { ExperimentReaDTO } from './experiment-rea.dto';
import { ExperimentTvepDTO } from './experiment-tvep.dto';

export const DTOs: Record<Exclude<ExperimentType, ExperimentType.NONE>, DTO<ExperimentType>> = {
  [ExperimentType.CVEP]: ExperimentCvepDTO,
  [ExperimentType.ERP]: ExperimentErpDTO,
  [ExperimentType.FVEP]: ExperimentFvepDTO,
  [ExperimentType.REA]: ExperimentReaDTO,
  [ExperimentType.TVEP]: ExperimentTvepDTO,
};

export const DTO_SCOPE = 'EXPERIMENTS';
