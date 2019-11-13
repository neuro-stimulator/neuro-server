import { Module } from '@nestjs/common';
import { SerialService } from './serial.service';
import { SerialGateway } from './serial.gateway';
import { LowLevelController } from './low-level.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [
    LowLevelController,
  ],
  imports: [
    MulterModule.register({
      dest: '/tmp/firmware'
    })
  ],
  providers: [
    SerialService,
    SerialGateway,
  ],
})
export class LowLevelModule {

}
