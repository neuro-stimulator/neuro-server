import { ExperimentCvepDTO } from './experiment-cvep.dto';
import { ExperimentErpDTO } from './experiment-erp.dto';
import { ExperimentFvepDTO } from './experiment-fvep.dto';
import { ExperimentReaDTO } from './experiment-rea.dto';
import { ExperimentTvepDTO } from './experiment-tvep.dto';
import { DTO } from '@diplomka-backend/stim-lib-common';

export const DTOs: Record<string, DTO> = {
  cvep: ExperimentCvepDTO,
  erp: ExperimentErpDTO,
  fvep: ExperimentFvepDTO,
  rea: ExperimentReaDTO,
  tvep: ExperimentTvepDTO,
};
