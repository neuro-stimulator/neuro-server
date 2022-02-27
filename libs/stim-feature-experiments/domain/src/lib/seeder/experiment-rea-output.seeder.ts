import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentReaOutputEntity } from '../model/entity/experiment-rea-output.entity';

@Injectable()
@Seeder(ExperimentReaOutputEntity)
export class ExperimentReaOutputSeeder extends BaseSeederService<ExperimentReaOutputEntity> {
  protected convertEntities(data: ExperimentReaOutputEntity[]): DeepPartial<ExperimentReaOutputEntity>[] {
    return plainToClass(ExperimentReaOutputEntity, data);
  }
}
