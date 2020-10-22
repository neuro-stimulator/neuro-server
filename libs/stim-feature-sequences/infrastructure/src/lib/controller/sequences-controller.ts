import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Experiment, MessageCodes, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import {
  SequenceIdNotFoundException,
  SequenceWasNotCreatedException,
  SequenceNotValidException,
  SequenceWasNotUpdatedException,
  ExperimentDoNotSupportSequencesException,
  SequenceWasNotDeletedException,
  InvalidSequenceSizeException,
} from '@diplomka-backend/stim-feature-sequences/domain';

import { SequencesFacade } from '../service/sequences.facade';
import { UserData } from '@diplomka-backend/stim-feature-auth/domain';
import { IsAuthorizedGuard } from '@diplomka-backend/stim-feature-auth/application';

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
  public async all(@UserData('id') userID?: number): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí.');
    try {
      const sequences = await this.facade.sequencesAll(userID);
      return {
        data: sequences,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání všech sekvencí!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Get('name-exists/:name/:id')
  public async nameExists(@Param() params: { name: string; id: number | 'new' }): Promise<ResponseObject<{ exists: boolean }>> {
    this.logger.log('Přišel požadavek na ověření existence názvu sekvence.');
    const exists = await this.facade.nameExists(params.name, params.id);
    return { data: { exists } };
  }

  @Get('experiments-as-sequence-source')
  public async experimentsAsSequenceSource(@UserData('id') userID: number): Promise<ResponseObject<Experiment<Output>[]>> {
    this.logger.log('Přišel požadavek na získání všech experimentů, kterí podporují sekvence.');
    const experiments: Experiment<Output>[] = await this.facade.experimentsAsSequenceSource(userID);
    return { data: experiments };
  }

  @Get('for-experiment/:id')
  public async sequencesForExperiment(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí pro zadaný experiment');
    try {
      const sequences = await this.facade.sequencesForExperiment(params.id, userID);
      return {
        data: sequences,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.warn('Experiment nebyl nalezen!');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof ExperimentDoNotSupportSequencesException) {
        const error = e as ExperimentDoNotSupportSequencesException;
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvenci pro zadaný experiment!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get('generate/:id/:sequenceSize')
  public async generateSequenceForExperiment(@Param() params: { id: number; sequenceSize: number }, @UserData('id') userID: number): Promise<ResponseObject<number[]>> {
    this.logger.debug('Přišel požadavek na vygenerování nové sekvence.');
    try {
      const numbers = await this.facade.generateSequenceForExperiment(params.id, params.sequenceSize, userID);
      return {
        data: numbers,
      };
    } catch (e) {
      if (e instanceof ExperimentDoNotSupportSequencesException) {
        const error = e as ExperimentDoNotSupportSequencesException;
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
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get('validate')
  public async validate(@Body() body: Sequence): Promise<ResponseObject<boolean>> {
    this.logger.log('Přišel požadavek na validaci sekvence.');
    try {
      const valid = await this.facade.validate(body);

      return { data: valid };
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        const error = e as SequenceNotValidException;
        this.logger.error('Kontrolovaná sekvence není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, error.errors);
      }
      this.logger.error('Nastala neočekávaná chyba při validaci sekvence!');
      this.logger.error(e);
    }
    throw new ControllerException();
  }

  @Get(':id')
  public async sequenceById(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na získání sekvence podle ID');
    try {
      const sequence = await this.facade.sequenceById(params.id, userID);
      return {
        data: sequence,
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundException) {
        const error = e as SequenceIdNotFoundException;
        this.logger.warn('Sekvence nebyla nalezena.');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvence!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Post()
  @UseGuards(IsAuthorizedGuard)
  public async insert(@Body() body: Sequence, @UserData('id') userID: number): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na vložení nové sekvence.');
    try {
      const sequenceID = await this.facade.insert(body, userID);
      const sequence: Sequence = await this.facade.sequenceById(sequenceID, userID);
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
        throw new ControllerException(error.errorCode, error.errors);
      } else if (e instanceof SequenceWasNotCreatedException) {
        const error = e as SequenceWasNotCreatedException;
        this.logger.error('Sekvenci se nepodařilo vytvořit!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Sekvenci se nepodařilo vytvořit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  @UseGuards(IsAuthorizedGuard)
  public async update(@Body() body: Sequence, @UserData('id') userID: number): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na aktualizaci sekvence.');
    try {
      await this.facade.update(body, userID);
      const sequence: Sequence = await this.facade.sequenceById(body.id, userID);
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
        throw new ControllerException(error.errorCode, error.errors);
      } else if (e instanceof SequenceIdNotFoundException) {
        const error = e as SequenceIdNotFoundException;
        this.logger.warn('Sekvence nebyla nalezena.');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else if (e instanceof SequenceWasNotUpdatedException) {
        const error = e as SequenceWasNotUpdatedException;
        this.logger.error('Sekvenci se nepodařilo aktualizovat!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.sequence.id });
      } else {
        this.logger.error('Sekvenci se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Delete(':id')
  @UseGuards(IsAuthorizedGuard)
  public async delete(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na smazání sekvence.');
    try {
      const sequence: Sequence = await this.facade.sequenceById(params.id, userID);
      await this.facade.delete(params.id, userID);
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
      if (e instanceof SequenceIdNotFoundException) {
        const error = e as SequenceIdNotFoundException;
        this.logger.warn('Sekvence nebyla nalezena!');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else if (e instanceof SequenceWasNotDeletedException) {
        const error = e as SequenceWasNotDeletedException;
        this.logger.error('Sekvenci se nepodařilo odstranit!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else {
        this.logger.error('Sekvenci se nepodařilo odstranit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
