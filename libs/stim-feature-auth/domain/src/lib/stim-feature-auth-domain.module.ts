import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENTITIES } from './model/entity/index';
import { REPOSITORIES } from './repository/index';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  providers: [...REPOSITORIES],
  exports: [...REPOSITORIES],
})
export class StimFeatureAuthDomainModule {}
