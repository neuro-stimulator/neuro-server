import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Options,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {
  MessageCodes,
  ResponseObject,
  Sequence,
} from '@stechy1/diplomka-share';

import { ExperimentDoNotSupportSequencesError } from '../../domain/exception/experiment-do-not-support-sequences.error';
import { SequenceIdNotFoundError } from '../../domain/exception/sequence-id-not-found.error';
import { SequenceWasNotCreatedError } from '../../domain/exception/sequence-was-not-created.error';
import { SequenceWasNotUpdatedError } from '../../domain/exception/sequence-was-not-updated.error';
import { SequenceWasNotDeletedError } from '../../domain/exception/sequence-was-not-deleted.error';
import { SequencesFacade } from '../service/sequences.facade';

@Controller('/api/sequences')
export class SequencesController {
  private readonly logger: Logger = new Logger(SequencesController.name);

  constructor(private readonly facade: SequencesFacade) {}

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
    try {
      const sequences = await this.facade.sequencesAll();
      return {
        data: sequences,
      };
    } catch (e) {
      this.logger.error(
        'Nastala neočekávaná chyba při získávání všech sekvencí!'
      );
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Get('name-exists/:name/:id')
  public async nameExists(
    @Param() params: { name: string; id: number | 'new' }
  ): Promise<ResponseObject<{ exists: boolean }>> {
    const exists = await this.facade.nameExists(params.name, params.id);
    return { data: { exists } };
  }

  // @Get('experiments-as-sequence-source')
  // public async experimentsAsSequenceSource(): Promise<
  //   ResponseObject<Experiment[]>
  // > {
  // const experiments = await this.facade.experimentsAsSequenceSource();
  // return { data: experiments };
  // }

  @Get('for-experiment/:id')
  public async sequencesForExperiment(
    @Param() params: { id: number }
  ): Promise<ResponseObject<Sequence[]>> {
    try {
      const sequences = await this.facade.sequencesForExperiment(params.id);
      return {
        data: sequences,
      };
    } catch (e) {
      this.logger.error(
        'Nastala neočekávaná chyba při hledání sekvenci pro zadaný experiment!'
      );
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Get('generate/:id/:sequenceSize')
  public async generateSequenceForExperiment(
    @Param() params: { id: number; sequenceSize: number }
  ): Promise<ResponseObject<number[]>> {
    try {
      const numbers = await this.facade.generateSequenceForExperiment(
        params.id,
        params.sequenceSize
      );
      return {
        data: numbers,
      };
    } catch (e) {
      if (e instanceof ExperimentDoNotSupportSequencesError) {
        this.logger.error('Experiment nepodporuje sekvence!');
        return {
          message: {
            code: MessageCodes.CODE_ERROR_SEQUENCE_UNSUPORTED_EXPERIMENT,
          },
        };
      } else {
        this.logger.error('Nastala neočekávaná chyba při generování sekvence');
        this.logger.error(e);
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
    // this.logger.debug('Budu generovat sekvenci...');
    // const experiment = await this._experiments.byId(params.id);
    // if (experiment === undefined) {
    //   this.logger.warn(`Experiment s id: ${params.id} nebyl nalezen!`);
    //   throw new ControllerException(
    //     MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
    //     { id: params.id }
    //   );
    // }
    //
    // if (experiment.type !== ExperimentType.ERP) {
    //   throw new ControllerException(
    //     MessageCodes.CODE_ERROR_SEQUENCE_UNSUPORTED_EXPERIMENT,
    //     { id: params.id }
    //   );
    // }
    // const sequence = await createSequence(
    //   experiment as ExperimentERP,
    //   params.sequenceSize
    // );
    //
    // return { data: sequence };
  }

  @Get('validate/:id')
  public async validate(
    @Param() params: { id: number }
  ): Promise<ResponseObject<boolean>> {
    try {
      const sequence: Sequence = await this.facade.sequenceByID(params.id);
      const valid = await this.facade.validate(sequence);

      return { data: valid };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e);
    }
    return {
      message: {
        code: MessageCodes.CODE_ERROR,
      },
    };
  }

  @Get(':id')
  public async sequenceById(
    @Param() params: { id: number }
  ): Promise<ResponseObject<Sequence>> {
    try {
      const sequence = await this.facade.sequenceByID(params.id);
      return {
        data: sequence,
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundError) {
        this.logger.warn('Sekvence nebyla nalezena.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND,
          },
        };
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvence!');
        this.logger.error(e);
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Post()
  public async insert(
    @Body() body: Sequence
  ): Promise<ResponseObject<Sequence>> {
    try {
      const sequenceID = await this.facade.insert(body);
      const sequence: Sequence = await this.facade.sequenceByID(sequenceID);
      return {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_CREATED,
          params: {
            id: sequence.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof SequenceWasNotCreatedError) {
        const error = e as SequenceWasNotCreatedError;
        if (error.error) {
          this.logger.error('Sekvenci se nepodařilo vytvořit!');
          this.logger.error(error.error);
          return {
            message: {
              code: 30301,
            },
          };
        }
      } else {
        this.logger.error(
          'Sekvenci se nepodařilo vytvořit z neznámého důvodu!'
        );
        this.logger.error(e);
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Patch()
  public async update(
    @Body() body: Sequence
  ): Promise<ResponseObject<Sequence>> {
    try {
      await this.facade.update(body);
      const sequence: Sequence = await this.facade.sequenceByID(body.id);
      return {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_UPDATED,
          params: {
            id: sequence.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundError) {
        this.logger.warn('Sekvence nebyla nalezena.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND,
          },
        };
      } else if (e instanceof SequenceWasNotUpdatedError) {
        const error = e as SequenceWasNotUpdatedError;
        if (error.error) {
          this.logger.error('Sekvenci se nepodařilo aktualizovat!');
          this.logger.error(error.error);
          return {
            message: {
              code: 30302,
            },
          };
        }
      } else {
        this.logger.error(
          'Sekvenci se nepodařilo aktualizovat z neznámého důvodu!'
        );
        this.logger.error(e);
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Delete(':id')
  public async delete(
    @Param() params: { id: number }
  ): Promise<ResponseObject<Sequence>> {
    try {
      const sequence: Sequence = await this.facade.sequenceByID(params.id);
      await this.facade.delete(params.id);
      return {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_DELETED,
          params: {
            id: sequence.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundError) {
        this.logger.warn('Sekvence nebyla nalezena!');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND,
          },
        };
      } else if (e instanceof SequenceWasNotDeletedError) {
        const error = e as SequenceWasNotDeletedError;
        if (error.error) {
          this.logger.error('Sekvenci se nepodařilo odstranit!');
          this.logger.error(error.error);
        }
        return {
          message: {
            code: 30303,
          },
        };
      } else {
        this.logger.error(
          'Sekvenci se nepodařilo odstranit z neznámého důvodu!'
        );
        this.logger.error(e);
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }
}
