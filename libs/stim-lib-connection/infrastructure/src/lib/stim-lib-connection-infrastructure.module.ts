import { Module } from '@nestjs/common';
import { StimLibConnectionApplicationModule } from '@neuro-server/stim-lib-connection/application';

@Module({
  controllers: [],
  imports: [StimLibConnectionApplicationModule],
  providers: [],
  exports: [],
})
export class StimLibConnectionInfrastructureModule {}
