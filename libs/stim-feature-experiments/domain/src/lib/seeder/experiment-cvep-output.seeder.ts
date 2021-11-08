import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentCvepOutputEntity } from '../model/entity/experiment-cvep-output.entity';

@Injectable()
@Seeder(ExperimentCvepOutputEntity)
export class ExperimentCvepOutputSeeder extends BaseSeederService<ExperimentCvepOutputEntity> {
  protected convertEntities(data: ExperimentCvepOutputEntity[]): ExperimentCvepOutputEntity[] {
    return plainToClass(ExperimentCvepOutputEntity, data);
  }
}
