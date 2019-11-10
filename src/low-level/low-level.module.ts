import { Module } from '@nestjs/common';
import { SerialService } from './SerialService';
import { SerialGateway } from './SerialGateway';
import { LowLevelController } from './low-level.controller';

@Module({
  controllers: [
    LowLevelController
  ],
  providers: [
    SerialService,
    SerialGateway,
  ],
})
export class LowLevelModule {

}
