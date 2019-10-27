import { Body, Controller, Get, Logger, Post, Put } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { Experiment, ResponseObject } from 'diplomka-share';

@Controller('/api/experiments')
export class ExperimentsController {

  private readonly logger = new Logger(ExperimentsController.name);

  constructor(private readonly _service: ExperimentsService) {}

  @Get()
  public async all(): Promise<ResponseObject<Experiment[]>> {
    return {data: await this._service.findAll()};
  }

  @Post()
  public async insert(@Body() body: Experiment): Promise<ResponseObject<Experiment>> {
    this.logger.log('New PUT request with body: ');
    this.logger.log(body);
    const experiment = await this._service.insert(body);
    this.logger.log(experiment);

    return {data: experiment};
  }

}
