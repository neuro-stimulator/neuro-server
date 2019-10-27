import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put } from '@nestjs/common';
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
    return {data: await this._service.insert(body)};
  }

  @Patch()
  public async update(@Body() body: Experiment): Promise<ResponseObject<Experiment>> {
    return {data: await this._service.update(body)};
  }

  @Delete(':id')
  public async delete(@Param() params: {id: number}): Promise<ResponseObject<Experiment>> {
    return {data: await this._service.delete(params.id)};
  }

}
