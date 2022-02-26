import { ExperimentCvepOutputEntity } from './experiment-cvep-output.entity';
import { ExperimentCvepEntity } from './experiment-cvep.entity';
import { ExperimentErpOutputDependencyEntity } from './experiment-erp-output-dependency.entity';
import { ExperimentErpOutputEntity } from './experiment-erp-output.entity';
import { ExperimentErpEntity } from './experiment-erp.entity';
import { ExperimentFvepOutputEntity } from './experiment-fvep-output.entity';
import { ExperimentFvepEntity } from './experiment-fvep.entity';
import { ExperimentReaOutputEntity } from './experiment-rea-output.entity';
import { ExperimentReaEntity } from './experiment-rea.entity';
import { ExperimentTvepOutputEntity } from './experiment-tvep-output.entity';
import { ExperimentTvepEntity } from './experiment-tvep.entity';
import { ExperimentEntity } from './experiment.entity';

export const ENTITIES = [
  ExperimentEntity,
  ExperimentCvepEntity,
  ExperimentCvepOutputEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentErpOutputDependencyEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentReaEntity,
  ExperimentReaOutputEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
];
