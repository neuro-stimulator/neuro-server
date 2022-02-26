import { ExperimentCvepOutputSeeder } from './experiment-cvep-output.seeder';
import { ExperimentCvepSeeder } from './experiment-cvep.seeder';
import { ExperimentErpOutputDependencySeeder } from './experiment-erp-output-dependency.seeder';
import { ExperimentErpOutputSeeder } from './experiment-erp-output.seeder';
import { ExperimentErpSeeder } from './experiment-erp.seeder';
import { ExperimentFvepOutputSeeder } from './experiment-fvep-output.seeder';
import { ExperimentFvepSeeder } from './experiment-fvep.seeder';
import { ExperimentReaOutputSeeder } from './experiment-rea-output.seeder';
import { ExperimentReaSeeder } from './experiment-rea.seeder';
import { ExperimentTvepOutputSeeder } from './experiment-tvep-output.seeder';
import { ExperimentTvepSeeder } from './experiment-tvep.seeder';
import { ExperimentSeeder } from './experiment.seeder';

export const SEEDERS = [
  ExperimentSeeder,
  ExperimentCvepSeeder,
  ExperimentCvepOutputSeeder,
  ExperimentErpSeeder,
  ExperimentErpOutputSeeder,
  ExperimentErpOutputDependencySeeder,
  ExperimentFvepSeeder,
  ExperimentFvepOutputSeeder,
  ExperimentReaSeeder,
  ExperimentReaOutputSeeder,
  ExperimentTvepSeeder,
  ExperimentTvepOutputSeeder,
];
