import { Module } from '@nestjs/common';

import { DtoFactory } from './dtoFactory';

@Module({
  controllers: [],
  providers: [DtoFactory],
  exports: [DtoFactory],
})
export class StimLibCommonModule {}
