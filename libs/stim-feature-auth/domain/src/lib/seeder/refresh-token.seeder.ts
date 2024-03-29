import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { RefreshTokenEntity } from '../model/entity/refresh-token.entity';

@Injectable()
@Seeder(RefreshTokenEntity)
export class RefreshTokenSeeder extends BaseSeederService<RefreshTokenEntity> {
  protected convertEntities(data: RefreshTokenEntity[]): DeepPartial<RefreshTokenEntity>[] {
    return plainToClass(RefreshTokenEntity, data);
  }
}
