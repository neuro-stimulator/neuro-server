import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post, Put } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { Experiment, ResponseObject } from 'diplomka-share';
import { ExperimentsGateway } from './experiments.gateway';

@Controller('/api/experiments')
export class ExperimentsController {

  private readonly logger = new Logger(ExperimentsController.name);

  constructor(private readonly _service: ExperimentsService,
              private readonly _gateway: ExperimentsGateway) {}

  @Get()
  public async all(): Promise<ResponseObject<Experiment[]>> {
    return {data: await this._service.findAll()};
  }

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Post()
  public async insert(@Body() body: Experiment): Promise<ResponseObject<Experiment>> {
    const experiment: Experiment = await this._service.insert(body);
    this._gateway.insert(experiment);
    return {data: experiment};
  }

  @Patch()
  public async update(@Body() body: Experiment): Promise<ResponseObject<Experiment>> {
    const experiment: Experiment = await this._service.update(body);
    this._gateway.update(experiment);
    return {data: experiment};
  }

  @Delete(':id')
  public async delete(@Param() params: {id: number}): Promise<ResponseObject<Experiment>> {
    const experiment: Experiment = await this._service.delete(params.id);
    this._gateway.delete(experiment);
    return {data: experiment};
  }

}
