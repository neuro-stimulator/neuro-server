import { ExperimentCvepRepository } from './experiment-cvep.repository';
import { ExperimentErpRepository } from './experiment-erp.repository';
import { ExperimentFvepRepository } from './experiment-fvep.repository';
import { ExperimentReaRepository } from './experiment-rea.repository';
import { ExperimentTvepRepository } from './experiment-tvep.repository';
import { ExperimentRepository } from './experiment.repository';

export const REPOSITORIES = [ExperimentRepository, ExperimentCvepRepository, ExperimentErpRepository, ExperimentFvepRepository, ExperimentTvepRepository, ExperimentReaRepository];
