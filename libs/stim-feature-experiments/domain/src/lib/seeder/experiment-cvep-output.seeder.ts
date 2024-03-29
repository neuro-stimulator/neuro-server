import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentCvepOutputEntity } from '../model/entity/experiment-cvep-output.entity';

@Injectable()
@Seeder(ExperimentCvepOutputEntity)
export class ExperimentCvepOutputSeeder extends BaseSeederService<ExperimentCvepOutputEntity> {
  protected convertEntities(data: ExperimentCvepOutputEntity[]): DeepPartial<ExperimentCvepOutputEntity>[] {
    return plainToClass(ExperimentCvepOutputEntity, data);
  }
}
