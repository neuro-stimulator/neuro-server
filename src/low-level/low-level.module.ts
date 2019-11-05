import { Module } from '@nestjs/common';
import { SerialService } from './SerialService';
import { SerialGateway } from './SerialGateway';

@Module({
  providers: [
    SerialService,
    SerialGateway,
  ],
})
export class LowLevelModule {

}
