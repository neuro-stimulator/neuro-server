import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { ResponseObject, Experiment } from 'diplomka-share';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): number[] {
    return this.appService.generateSequence([
      {
        value: 1,
        likelihood: 0.7,
        dependencies: [
          {
            stimul: 0,
            occurrence: 3,
            inRow: true,
          },
        ],
      },
      {
        value: 2,
        likelihood: 0.6,
        dependencies: [
          {
            stimul: 1,
            occurrence: 2,
            inRow: false,
          },
        ],
      },
    ], 100);
  }

  @Get('/api/experiments')
  allExperiments(): ResponseObject<Experiment[]> {
    const records: Experiment[] = [];

    for (let i = 0; i < 20; i++) {
      const random: number = Math.random();
      const output = {};
      if (random > 0.33) {
        output['led'] = true;
      }
      if (random > 0.6) {
        output['image'] = true;
      }
      if (random > 0.9) {
        output['sound'] = true;
      }

      records.push({
        id: `${i}`,
        name: `${i}. Experiment`,
        type: 'erp',
        created: new Date().getTime(),
        description: 'Lorem Ipsum je demonstrativní výplňový text používaný v tiskařském a knihařském průmyslu.',
        output,
      });
    }

    return {
      records,
    };
  }
}
