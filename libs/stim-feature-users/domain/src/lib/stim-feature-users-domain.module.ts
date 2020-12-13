import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENTITIES } from './model/entity';
import { REPOSITORIES } from './repository';
import { SEEDERS } from './seeder';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  providers: [...REPOSITORIES, ...SEEDERS],
  exports: [...REPOSITORIES],
})
export class StimFeatureUsersDomainModule {}
