import { ExperimentEntity } from './experiment.entity';
import { ExperimentCvepEntity } from './experiment-cvep.entity';
import { ExperimentErpEntity } from './experiment-erp.entity';
import { ExperimentErpOutputEntity } from './experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './experiment-erp-output-dependency.entity';
import { ExperimentFvepEntity } from './experiment-fvep.entity';
import { ExperimentFvepOutputEntity } from './experiment-fvep-output.entity';
import { ExperimentReaEntity } from './experiment-rea.entity';
import { ExperimentTvepEntity } from './experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from './experiment-tvep-output.entity';

export const ENTITIES = [
  ExperimentEntity,
  ExperimentCvepEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentErpOutputDependencyEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentReaEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
];

export * from './experiment.entity';
export * from './experiment-cvep.entity';
export * from './experiment-erp.entity';
export * from './experiment-erp-output.entity';
export * from './experiment-erp-output-dependency.entity';
export * from './experiment-fvep.entity';
export * from './experiment-fvep-output.entity';
export * from './experiment-rea.entity';
export * from './experiment-tvep.entity';
export * from './experiment-tvep-output.entity';
