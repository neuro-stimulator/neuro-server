import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';

@Injectable()
@Seeder(ExperimentFvepOutputEntity)
export class ExperimentFvepOutputSeeder extends BaseSeederService<ExperimentFvepOutputEntity> {
  protected convertEntities(data: ExperimentFvepOutputEntity[]): DeepPartial<ExperimentFvepOutputEntity>[] {
    return plainToClass(ExperimentFvepOutputEntity, data);
  }
}
