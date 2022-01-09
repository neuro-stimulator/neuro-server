import { Module } from '@nestjs/common';

import { EntityStatisticsSerializer } from './util/entity-statistics.serializer';

@Module({
  controllers: [],
  providers: [EntityStatisticsSerializer],
  exports: [EntityStatisticsSerializer],
})
export class StimFeatureSeedDomainModule {}
