import { Body, Controller, Delete, Get, Logger, Options, Param, Patch } from '@nestjs/common';

import { ExperimentResult, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentResultsService } from './experiment-results.service';
import { ControllerException } from '../controller-exception';

@Controller('api/experiment-results')
export class ExperimentResultsController {

  private readonly logger = new Logger(ExperimentResultsController.name);

  constructor(private readonly _service: ExperimentResultsService) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get()
  public async all(): Promise<ResponseObject<ExperimentResult[]>> {
    return { data: await this._service.findAll() };
  }

  @Get(':id')
  public async experimentResultById(@Param() params: { id: number }): Promise<ResponseObject<ExperimentResult>> {
    const experimentResult = await this._service.byId(params.id);
    if (experimentResult === undefined) {
      this.logger.warn(`Výsledek experimentu s id: ${params.id} nebyl nalezen!`);
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, {id: +params.id});
    }
    this.logger.verbose(experimentResult);
    await this._service.validateExperimentResult(experimentResult);

    return { data: experimentResult };
  }

  @Get('result-data/:id')
  public async resultData(@Param() params: {id: number}): Promise<ResponseObject<any>> {
    const experimentData: any = await this._service.experimentData(params.id);
    if (experimentData === undefined) {
      this.logger.warn(`Data výsledku experimentu s id: ${params.id} nebyla nalezena!`);
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_DATA_NOT_FOUND, {id: params.id});
    }

    return { data: experimentData };
  }

  @Patch()
  public async update(@Body() body: ExperimentResult): Promise<ResponseObject<ExperimentResult>> {
    await this._service.validateExperimentResult(body);
    const experimentResult: ExperimentResult = await this._service.update(body);
    if (experimentResult === undefined) {
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, {id: body.id});
    }

    return {
      data: experimentResult,
      message: {
        code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATED,
        params: {
          id: experimentResult.id
        }
      }
    };
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<ExperimentResult>> {
    const experimentResult: ExperimentResult = await this._service.delete(params.id);
    if (experimentResult === undefined) {
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, {id: +params.id});
    }

    return {
      data: experimentResult,
      message: {
        code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_DELETED,
        params: {
          id: experimentResult.id
        }
      }
    };
  }

}
