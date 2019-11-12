import { Module } from '@nestjs/common';
import { SerialService } from './serial.service';
import { SerialGateway } from './serial.gateway';
import { LowLevelController } from './low-level.controller';

@Module({
  controllers: [
    LowLevelController,
  ],
  providers: [
    SerialService,
    SerialGateway,
  ],
})
export class LowLevelModule {

}
