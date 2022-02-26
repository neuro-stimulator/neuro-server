import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentCvepEntity } from '../model/entity/experiment-cvep.entity';

@Injectable()
@Seeder(ExperimentCvepEntity)
export class ExperimentCvepSeeder extends BaseSeederService<ExperimentCvepEntity> {
  protected convertEntities(data: ExperimentCvepEntity[]): ExperimentCvepEntity[] {
    return plainToClass(ExperimentCvepEntity, data);
  }
}
