import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Options, Param, Patch, Post } from '@nestjs/common';

import { ExperimentResult, ResponseMessageType, ResponseObject } from 'diplomka-share';
import { ExperimentResultsService } from './experiment-results.service';

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
  public async experimentById(@Param() params: { id: number }): Promise<ResponseObject<ExperimentResult>> {
    const experimentResult = await this._service.byId(params.id);
    this.logger.verbose(experimentResult);
    if (experimentResult === undefined) {
      this.logger.warn(`Výsledek experimentu s id: ${params.id} nebyl nalezen!`);
      throw new HttpException({
        message: {
          text: `Výsledek experimentu s id: ${params.id} nebyl nalezen!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: experimentResult };
  }

  @Get('result-data/:id')
  public async resultData(@Param() params: {id: number}): Promise<ResponseObject<any>> {
    const experimentData: any = await this._service.experimentData(params.id);
    if (experimentData === undefined) {
      this.logger.warn(`Data výsledku experimentu s id: ${params.id} nebyla nalezena!`);
      throw new HttpException({
        message: {
          text: `Data výsledku experimentu s id: ${params.id} nebyla nalezena!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: experimentData };
  }

  // @Post()
  // public async insert(@Body() body: ExperimentResult): Promise<ResponseObject<ExperimentResult>> {
  //   const experiment: ExperimentResult = await this._service.insert(body);
  //   return { data: experiment, message: { text: 'Výsledek experiment byl úspěšně vytvořen.', type: 0 } };
  // }
  //
  // @Patch()
  // public async update(@Body() body: ExperimentResult): Promise<ResponseObject<ExperimentResult>> {
  //   const experiment: ExperimentResult = await this._service.update(body);
  //   if (experiment === undefined) {
  //     throw new HttpException({
  //       message: {
  //         text: `Výsledek experimentu s id: ${body.id} nebyl nalezen!`,
  //         type: ResponseMessageType.ERROR,
  //       },
  //     }, HttpStatus.OK);
  //   }
  //
  //   return { data: experiment, message: { text: 'Výsledek experimentu byl úspěšně aktualizován.', type: 0 } };
  // }
  //
  // @Delete(':id')
  // public async delete(@Param() params: { id: number }): Promise<ResponseObject<ExperimentResult>> {
  //   const experiment: ExperimentResult = await this._service.delete(params.id);
  //   if (experiment === undefined) {
  //     throw new HttpException({
  //       message: {
  //         text: `Výsledek experimentu s id: ${params.id} nebyl nalezen!`,
  //         type: ResponseMessageType.ERROR,
  //       },
  //     }, HttpStatus.OK);
  //   }
  //
  //   return { data: experiment, message: { text: 'Výsledek experimentu byl úspěšně odstraněn.', type: 0 } };
  // }

}
