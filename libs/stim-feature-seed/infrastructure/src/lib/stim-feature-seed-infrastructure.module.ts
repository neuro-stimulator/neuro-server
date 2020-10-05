import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSeedApplicationModule } from '@diplomka-backend/stim-feature-seed/application';

import { SeedController } from './controller/seed.controller';
import { SeedFacade } from './service/seed.facade';

@Module({
  controllers: [SeedController],
  imports: [CqrsModule, StimFeatureSeedApplicationModule],
  providers: [SeedFacade],
})
export class StimFeatureSeedInfrastructureModule {}
