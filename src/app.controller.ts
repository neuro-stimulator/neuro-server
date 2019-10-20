import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

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
}
