import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentReaOutputEntity } from '../model/entity/experiment-rea-output.entity';

@Injectable()
@Seeder(ExperimentReaOutputEntity)
export class ExperimentReaOutputSeeder extends BaseSeederService<ExperimentReaOutputEntity> {
  protected convertEntities(data: ExperimentReaOutputEntity[]): ExperimentReaOutputEntity[] {
    return plainToClass(ExperimentReaOutputEntity, data);
  }
}
