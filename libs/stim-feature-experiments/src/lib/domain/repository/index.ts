import { ExperimentRepository } from './experiment.repository';
import { ExperimentCvepRepository } from './experiment-cvep.repository';
import { ExperimentErpRepository } from './experiment-erp.repository';
import { ExperimentFvepRepository } from './experiment-fvep.repository';
import { ExperimentReaRepository } from './experiment-rea.repository';
import { ExperimentTvepRepository } from './experiment-tvep.repository';

export const REPOSITORIES = [
  ExperimentRepository,
  ExperimentCvepRepository,
  ExperimentErpRepository,
  ExperimentFvepRepository,
  ExperimentReaRepository,
  ExperimentTvepRepository,
];

export * from './experiment.repository';
export * from './experiment-cvep.repository';
export * from './experiment-erp.repository';
export * from './experiment-fvep.repository';
export * from './experiment-rea.repository';
export * from './experiment-tvep.repository';
