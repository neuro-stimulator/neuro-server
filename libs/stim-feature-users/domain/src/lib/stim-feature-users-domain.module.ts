import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './model/entity/user.entity';
import { REPOSITORIES } from './repository/index';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [...REPOSITORIES],
  exports: [...REPOSITORIES],
})
export class StimFeatureUsersDomainModule {}
