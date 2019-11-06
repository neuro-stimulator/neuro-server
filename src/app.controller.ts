import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { Experiment, ExperimentType, ResponseObject } from 'diplomka-share';

@Controller()
export class AppController {

  private static readonly SEQUENCE_SIZE = 100;

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): any {
    const sequence: number[] = this.appService.generateSequence([
      {
        value: 1,
        likelihood: 0.9,
        dependencies: [
          {
            stimul: 0,
            occurrence: 2,
            inRow: true,
          },
        ],
      },
      {
        value: 2,
        likelihood: 0.9,
        dependencies: [
          {
            stimul: 1,
            occurrence: 2,
            inRow: false,
          },
        ],
      },
    ], AppController.SEQUENCE_SIZE);
    const analyse = this.appService.analyseSequence(sequence);

    return {analyse};
  }
}
