import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Options, Param, Patch, Post } from '@nestjs/common';

import { Experiment, ExperimentERP, ExperimentType, ResponseMessageType, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../experiments/experiments.service';
import { SequencesService } from './sequences.service';
import { createSequence } from './sequences-generator';

@Controller('/api/sequences')
export class SequencesController {

  private readonly logger: Logger = new Logger(SequencesController.name);

  constructor(private readonly _service: SequencesService,
              private readonly _experiments: ExperimentsService) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get()
  public async all(): Promise<ResponseObject<Sequence[]>> {
    return { data: await this._service.findAll() };
  }

  @Get('experiments-as-sequence-source')
  public async experimentsAsSequenceSource(): Promise<ResponseObject<Experiment[]>> {
    const experiments = await this._service.experimentsAsSequenceSource();
    return { data: experiments };
  }

  @Get('for-experiment/:id')
  public async sequencesForExperiment(@Param() params: { id: number }): Promise<ResponseObject<Sequence[]>> {
    const sequences = await this._service.findAll({ where: { experimentID: params.id }});
    return { data: sequences };
  }

  @Get('generate/:id/:sequenceSize')
  public async generateSequenceForExperiment(@Param() params: { id: number, sequenceSize: number }):
    Promise<ResponseObject<number[]>> {
    this.logger.debug('Budu generovat sekvenci...');
    const experiment = await this._experiments.byId(params.id);
    if (experiment.type !== ExperimentType.ERP) {
      throw new HttpException({
        message: {
          text: 'Experiment nepodporuje sekvence!',
          type: ResponseMessageType.ERROR
        }
      }, HttpStatus.OK);
    }
    const sequence = await createSequence(experiment as ExperimentERP, params.sequenceSize);

    return {data: sequence };
  }

  @Get(':id')
  public async sequenceById(@Param() params: { id: number }): Promise<ResponseObject<Sequence>> {
    const sequence = await this._service.byId(params.id);
    if (sequence === undefined) {
      this.logger.warn(`Sequence s id: ${params.id} nebyla nalezena!`);
      throw new HttpException({
        message: {
          text: `Sequence s id: ${params.id} nebyla nalezena!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: sequence };
  }

  @Post()
  public async insert(@Body() body: Sequence): Promise<ResponseObject<Sequence>> {
    const sequence: Sequence = await this._service.insert(body);
    return { data: sequence, message: { text: 'Sequence byla úspěšně vytvořena.', type: 0 } };
  }

  @Patch()
  public async update(@Body() body: Sequence): Promise<ResponseObject<Sequence>> {
    const experiment: Sequence = await this._service.update(body);
    if (experiment === undefined) {
      throw new HttpException({
        message: {
          text: `Sequence s id: ${body.id} nebyla nalezena!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: experiment, message: { text: 'Sequence byla úspěšně aktualizována.', type: 0 } };
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<Sequence>> {
    const experiment: Sequence = await this._service.delete(params.id);
    if (experiment === undefined) {
      throw new HttpException({
        message: {
          text: `Sequence s id: ${params.id} nebyla nalezena!`,
          type: ResponseMessageType.ERROR,
        },
      }, HttpStatus.OK);
    }

    return { data: experiment, message: { text: 'Sequence byla úspěšně odstraněna.', type: 0 } };
  }

}
