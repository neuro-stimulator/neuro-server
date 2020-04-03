import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post } from '@nestjs/common';

import { Experiment, ExperimentERP, ExperimentType, MessageCodes, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../experiments/experiments.service';
import { ControllerException } from '../controller-exception';
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
    if (experiment === undefined) {
      this.logger.warn(`Experiment s id: ${params.id} nebyl nalezen!`);
      throw new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, {id: params.id});
    }

    if (experiment.type !== ExperimentType.ERP) {
      throw new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_UNSUPORTED_EXPERIMENT, {id: params.id});
    }
    const sequence = await createSequence(experiment as ExperimentERP, params.sequenceSize);

    return {data: sequence };
  }

  @Get('name-exists/:name/:id')
  public async nameExists(@Param() params: { name: string, id: number|'new' }): Promise<ResponseObject<{exists: boolean}>> {
    const exists = await this._service.nameExists(params.name, params.id);
    return {data: { exists }};
  }

  @Get(':id')
  public async sequenceById(@Param() params: { id: number }): Promise<ResponseObject<Sequence>> {
    const sequence = await this._service.byId(params.id);
    if (sequence === undefined) {
      this.logger.warn(`Sequence s id: ${params.id} nebyla nalezena!`);
      throw new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, {id: params.id});
    }
    await this._service.validateSequence(sequence);

    return { data: sequence };
  }

  @Post()
  public async insert(@Body() body: Sequence): Promise<ResponseObject<Sequence>> {
    await this._service.validateSequence(body);
    const sequence: Sequence = await this._service.insert(body);
    return {
      data: sequence,
      message: {
        code: MessageCodes.CODE_SUCCESS_SEQUENCE_CREATED,
        params: {
          id: sequence.id
        }
      }
    };
  }

  @Patch()
  public async update(@Body() body: Sequence): Promise<ResponseObject<Sequence>> {
    await this._service.validateSequence(body);
    const sequence: Sequence = await this._service.update(body);
    if (sequence === undefined) {
      throw new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, {id: body.id});
    }

    return {
      data: sequence,
      message: {
        code: MessageCodes.CODE_SUCCESS_SEQUENCE_UPDATED,
        params: {
          id: sequence.id
        }
      }
    };
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<Sequence>> {
    const sequence: Sequence = await this._service.delete(params.id);
    if (sequence === undefined) {
      throw new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, {id: params.id});
    }

    return {
      data: sequence,
      message: {
        code: MessageCodes.CODE_SUCCESS_SEQUENCE_DELETED,
        params: {
          id: sequence.id
        }
      }
    };
  }

}
