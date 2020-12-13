import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';

@Injectable()
@Seeder(ExperimentReaEntity)
export class ExperimentReaSeeder extends BaseSeederService<ExperimentReaEntity> {
  protected convertEntities(data: ExperimentReaEntity[]): ExperimentReaEntity[] {
    return plainToClass(ExperimentReaEntity, data);
  }
}
