import { Module } from '@nestjs/common';

import { DtoFactory } from './dto-factory';

@Module({
  controllers: [],
  providers: [DtoFactory],
  exports: [DtoFactory],
})
export class StimLibCommonModule {}
