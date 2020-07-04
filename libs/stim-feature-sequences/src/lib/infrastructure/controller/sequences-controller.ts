import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post } from '@nestjs/common';

import { MessageCodes, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { ExperimentIdNotFoundError } from '@diplomka-backend/stim-feature-experiments';

import { ExperimentDoNotSupportSequencesError } from '../../domain/exception/experiment-do-not-support-sequences.error';
import { InvalidSequenceSizeException } from '../../domain/exception/invalid-sequence-size.exception';
import { SequenceNotValidException } from '../../domain/exception/sequence-not-valid.exception';
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
    this.logger.log('Přišel požadavek na získání všech sekvencí.');
    try {
      const sequences = await this.facade.sequencesAll();
      return {
        data: sequences,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání všech sekvencí!');
      this.logger.error(e);
      throw new ControllerException();
    }
  }

  @Get('name-exists/:name/:id')
  public async nameExists(@Param() params: { name: string; id: number | 'new' }): Promise<ResponseObject<{ exists: boolean }>> {
    this.logger.log('Přišel požadavek na ověření existence názvu sekvence.');
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
  public async sequencesForExperiment(@Param() params: { id: number }): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí pro zadaný experiment');
    try {
      const sequences = await this.facade.sequencesForExperiment(params.id);
      return {
        data: sequences,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        const error = e as ExperimentIdNotFoundError;
        this.logger.warn('Experiment nebyl nalezen!');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof ExperimentDoNotSupportSequencesError) {
        const error = e as ExperimentDoNotSupportSequencesError;
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvenci pro zadaný experiment!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Get('generate/:id/:sequenceSize')
  public async generateSequenceForExperiment(@Param() params: { id: number; sequenceSize: number }): Promise<ResponseObject<number[]>> {
    try {
      const numbers = await this.facade.generateSequenceForExperiment(params.id, params.sequenceSize);
      return {
        data: numbers,
      };
    } catch (e) {
      if (e instanceof ExperimentDoNotSupportSequencesError) {
        const error = e as ExperimentDoNotSupportSequencesError;
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof InvalidSequenceSizeException) {
        const error = e as InvalidSequenceSizeException;
        this.logger.error('Sekvence má nastavenou nevalidní délku!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { sequenceSize: error.sequenceSize });
      } else {
        this.logger.error('Nastala neočekávaná chyba při generování sekvence');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Get('validate/:id')
  public async validate(@Param() params: { id: number }): Promise<ResponseObject<boolean>> {
    try {
      const sequence: Sequence = await this.facade.sequenceById(params.id);
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
  public async sequenceById(@Param() params: { id: number }): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na získání sekvence podle ID');
    try {
      const sequence = await this.facade.sequenceById(params.id);
      return {
        data: sequence,
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundError) {
        const error = e as SequenceIdNotFoundError;
        this.logger.warn('Sekvence nebyla nalezena.');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvence!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Post()
  public async insert(@Body() body: Sequence): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na vložení nové sekvence.');
    try {
      const sequenceID = await this.facade.insert(body);
      const sequence: Sequence = await this.facade.sequenceById(sequenceID);
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
      if (e instanceof SequenceNotValidException) {
        const error = e as SequenceNotValidException;
        this.logger.error('Vkládaná sekvence není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof SequenceWasNotCreatedError) {
        const error = e as SequenceWasNotCreatedError;
        this.logger.error('Sekvenci se nepodařilo vytvořit!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Sekvenci se nepodařilo vytvořit z neznámého důvodu!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  public async update(@Body() body: Sequence): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na aktualizaci sekvence.');
    try {
      await this.facade.update(body);
      const sequence: Sequence = await this.facade.sequenceById(body.id);
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
      if (e instanceof SequenceNotValidException) {
        const error = e as SequenceNotValidException;
        this.logger.error('Aktualizovaná sekvence není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof SequenceIdNotFoundError) {
        const error = e as SequenceIdNotFoundError;
        this.logger.warn('Sekvence nebyla nalezena.');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else if (e instanceof SequenceWasNotUpdatedError) {
        const error = e as SequenceWasNotUpdatedError;
        this.logger.error('Sekvenci se nepodařilo aktualizovat!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.sequence.id });
      } else {
        this.logger.error('Sekvenci se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na smazání sekvence.');
    try {
      const sequence: Sequence = await this.facade.sequenceById(params.id);
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
        const error = e as SequenceIdNotFoundError;
        this.logger.warn('Sekvence nebyla nalezena!');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else if (e instanceof SequenceWasNotDeletedError) {
        const error = e as SequenceWasNotDeletedError;
        this.logger.error('Sekvenci se nepodařilo odstranit!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else {
        this.logger.error('Sekvenci se nepodařilo odstranit z neznámého důvodu!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }
}
