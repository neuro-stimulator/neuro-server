import { Module, Global } from '@nestjs/common';
import { StimFeatureFileBrowserController } from './stim-feature-file-browser.controller';

@Global()
@Module({
  controllers: [StimFeatureFileBrowserController],
  providers: [],
  exports: [],
})
export class StimFeatureFileBrowserModule {}
