import { Injectable } from '@nestjs/common';
import { SerialService } from './serial.service';

@Injectable()
export class StimulatorService {
  constructor(private readonly service: SerialService) {}
}
