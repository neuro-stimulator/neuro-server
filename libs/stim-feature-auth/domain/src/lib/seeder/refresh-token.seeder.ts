import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { RefreshTokenEntity } from '../model/entity/refresh-token.entity';

@Injectable()
@Seeder(RefreshTokenEntity)
export class RefreshTokenSeeder extends BaseSeederService<RefreshTokenEntity> {
  protected convertEntities(data: RefreshTokenEntity[]): RefreshTokenEntity[] {
    return plainToClass(RefreshTokenEntity, data);
  }
}
