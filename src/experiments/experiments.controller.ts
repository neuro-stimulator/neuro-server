import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post} from '@nestjs/common';

import { Experiment, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentsService } from './experiments.service';
import { ControllerException } from '../controller-exception';

@Controller('/api/experiments')
export class ExperimentsController {

  private readonly logger = new Logger(ExperimentsController.name);

  constructor(private readonly _service: ExperimentsService) {}

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
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, {id: params.id});
    }

    return { data: multimedia };
  }

  @Get(':id')
  public async experimentById(@Param() params: { id: number }): Promise<ResponseObject<Experiment>> {
    const experiment = await this._service.byId(params.id);
    if (experiment === undefined) {
      this.logger.warn(`Experiment s id: ${params.id} nebyl nalezen!`);
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, {id: params.id});
    }
    this.logger.verbose(experiment);
    const valid = await this._service.validateExperiment(experiment);

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
    const valid = await this._service.validateExperiment(body);
    const experiment: Experiment = await this._service.insert(body);
    return {
      data: experiment,
      message: {
        code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
        params: {
          id: experiment.id
        }
      }
    };
  }

  @Patch()
  public async update(@Body() body: Experiment): Promise<ResponseObject<Experiment>> {
    const valid = await this._service.validateExperiment(body);
    const experiment: Experiment = await this._service.update(body);
    if (experiment === undefined) {
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, {id: body.id});
    }

    return {
      data: experiment,
      message: {
        code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
        params: {
          id: experiment.id
        }
      }
    };
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<Experiment>> {
    const experiment: Experiment = await this._service.delete(params.id);
    if (experiment === undefined) {
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, {id: params.id});
    }

    return {
      data: experiment,
      message: {
        code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
        params: {
          id: experiment.id
        }
      }
    };
  }

}
