import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';

@Injectable()
@Seeder(ExperimentReaEntity)
export class ExperimentReaSeeder extends BaseSeederService<ExperimentReaEntity> {
  protected convertEntities(data: ExperimentReaEntity[]): DeepPartial<ExperimentReaEntity>[] {
    return plainToClass(ExperimentReaEntity, data);
  }
}
