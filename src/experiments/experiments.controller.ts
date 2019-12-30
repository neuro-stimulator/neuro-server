import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Options, Param, Patch, Post} from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { Experiment, ResponseMessageType, ResponseObject } from 'diplomka-share';
import { ExperimentsGateway } from './experiments.gateway';

@Controller('/api/experiments')
export class ExperimentsController {

  private readonly logger = new Logger(ExperimentsController.name);

  constructor(private readonly _service: ExperimentsService,
              private readonly _gateway: ExperimentsGateway) {
  }

  @Get()
  public async all(): Promise<ResponseObject<Experiment[]>> {
    return { data: await this._service.findAll() };
  }

  @Get('multimedia/:id')
  public async usedOutputMultimedia(@Param() params: { id: number }) {
    const multimedia = await this._service.usedOutputMultimedia(params.id);
    this.logger.verbose(multimedia);
    if (multimedia === undefined) {
      this.logger.warn(`Experiment s id: ${params.id} nebyl nalezen!`);
      throw new HttpException({
        message: {
          text: `Experiment s id: ${params.id} nebyl nalezen!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: multimedia };
  }

  @Get(':id')
  public async experimentById(@Param() params: { id: number }): Promise<ResponseObject<Experiment>> {
    const experiment = await this._service.byId(params.id);
    this.logger.verbose(experiment);
    if (experiment === undefined) {
      this.logger.warn(`Experiment s id: ${params.id} nebyl nalezen!`);
      throw new HttpException({
        message: {
          text: `Experiment s id: ${params.id} nebyl nalezen!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: experiment };
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
    return { data: experiment, message: { text: 'Experiment byl úspěšně vytvořen.', type: 0 } };
  }

  @Patch()
  public async update(@Body() body: Experiment): Promise<ResponseObject<Experiment>> {
    const experiment: Experiment = await this._service.update(body);
    if (experiment === undefined) {
      throw new HttpException({
        message: {
          text: `Experiment s id: ${body.id} nebyl nalezen!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    this._gateway.update(experiment);
    return { data: experiment, message: { text: 'Experiment byl úspěšně aktualizován.', type: 0 } };
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<Experiment>> {
    const experiment: Experiment = await this._service.delete(params.id);
    if (experiment === undefined) {
      throw new HttpException({
        message: {
          text: `Experiment s id: ${params.id} nebyl nalezen!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    this._gateway.delete(experiment);
    return { data: experiment, message: { text: 'Experiment byl úspěšně odstraněn.', type: 0 } };
  }

}
