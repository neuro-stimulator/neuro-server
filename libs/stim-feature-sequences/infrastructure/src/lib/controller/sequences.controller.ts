import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Experiment, MessageCodes, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';
import { UserData, UserGroupsData } from '@neuro-server/stim-feature-auth/domain';
import { ExperimentIdNotFoundException } from '@neuro-server/stim-feature-experiments/domain';
import {
  SequenceIdNotFoundException,
  SequenceWasNotCreatedException,
  SequenceNotValidException,
  SequenceWasNotUpdatedException,
  ExperimentDoNotSupportSequencesException,
  SequenceWasNotDeletedException,
  InvalidSequenceSizeException
} from '@neuro-server/stim-feature-sequences/domain';
import { ControllerException } from '@neuro-server/stim-lib-common';

import { SequencesFacade } from '../service/sequences.facade';

@Controller('/api/sequences')
export class SequencesController {
  private readonly logger: Logger = new Logger(SequencesController.name);

  constructor(private readonly facade: SequencesFacade) {
  }

  @Options('')
  public async optionsEmpty(): Promise<string> {
    return '';
  }

  @Options('*')
  public async optionsWildcard(): Promise<string> {
    return '';
  }

  @Get()
  public async all(@UserGroupsData() userGroups: number[]): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí.');
    try {
      const sequences = await this.facade.sequencesAll(userGroups);
      return {
        data: sequences
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
  public async experimentsAsSequenceSource(@UserGroupsData() userGroups: number[]): Promise<ResponseObject<Experiment<Output>[]>> {
    this.logger.log('Přišel požadavek na získání všech experimentů, kterí podporují sekvence.');
    const experiments: Experiment<Output>[] = await this.facade.experimentsAsSequenceSource(userGroups);
    return { data: experiments };
  }

  @Get('for-experiment/:id')
  public async sequencesForExperiment(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí pro zadaný experiment');
    try {
      const sequences = await this.facade.sequencesForExperiment(userGroups, params.id);
      return {
        data: sequences
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        this.logger.warn('Experiment nebyl nalezen!');
        this.logger.warn(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else if (e instanceof ExperimentDoNotSupportSequencesException) {
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvenci pro zadaný experiment!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get('generate/:id/:sequenceSize')
  public async generateSequenceForExperiment(
    @Param() params: { id: number; sequenceSize: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<number[]>> {
    this.logger.debug('Přišel požadavek na vygenerování nové sekvence.');
    try {
      const numbers = await this.facade.generateSequenceForExperiment(userGroups, params.id, params.sequenceSize);
      return {
        data: numbers
      };
    } catch (e) {
      if (e instanceof ExperimentDoNotSupportSequencesException) {
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else if (e instanceof InvalidSequenceSizeException) {
        this.logger.error('Sekvence má nastavenou nevalidní délku!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { sequenceSize: e.sequenceSize });
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
        this.logger.error('Kontrolovaná sekvence není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      }
      this.logger.error('Nastala neočekávaná chyba při validaci sekvence!');
      this.logger.error(e);
    }
    throw new ControllerException();
  }

  @Get(':id')
  public async sequenceById(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na získání sekvence podle ID');
    try {
      const sequence = await this.facade.sequenceById(userGroups, params.id);
      return {
        data: sequence
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundException) {
        this.logger.error('Sekvence nebyla nalezena.');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.sequenceID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání sekvence!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Post()
  @UseGuards(IsAuthorizedGuard)
  public async insert(
    @Body() body: Sequence,
    @UserData('id') userId: number,
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na vložení nové sekvence.');
    try {
      const sequenceID = await this.facade.insert(userId, body);
      const sequence: Sequence = await this.facade.sequenceById(userGroups, sequenceID);
      return {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_CREATED,
          params: {
            id: sequence.id
          }
        }
      };
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        this.logger.error('Vkládaná sekvence není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof SequenceWasNotCreatedException) {
        this.logger.error('Sekvenci se nepodařilo vytvořit!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Sekvenci se nepodařilo vytvořit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  @UseGuards(IsAuthorizedGuard)
  public async update(
    @Body() body: Sequence,
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na aktualizaci sekvence.');
    try {
      await this.facade.update(userGroups, body);
      const sequence: Sequence = await this.facade.sequenceById(userGroups, body.id);
      return {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_UPDATED,
          params: {
            id: sequence.id
          }
        }
      };
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        this.logger.error('Aktualizovaná sekvence není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof SequenceIdNotFoundException) {
        this.logger.error('Sekvence nebyla nalezena.');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.sequenceID });
      } else if (e instanceof SequenceWasNotUpdatedException) {
        this.logger.error('Sekvenci se nepodařilo aktualizovat!');
        if (e.error) {
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode, { id: e.sequence.id });
      } else {
        this.logger.error('Sekvenci se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Delete(':id')
  @UseGuards(IsAuthorizedGuard)
  public async delete(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek na smazání sekvence.');
    try {
      const sequence: Sequence = await this.facade.sequenceById(userGroups, params.id);
      await this.facade.delete(userGroups, params.id);
      return {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_DELETED,
          params: {
            id: sequence.id
          }
        }
      };
    } catch (e) {
      if (e instanceof SequenceIdNotFoundException) {
        this.logger.error('Sekvence nebyla nalezena!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.sequenceID });
      } else if (e instanceof SequenceWasNotDeletedException) {
        this.logger.error('Sekvenci se nepodařilo odstranit!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.sequenceID });
      } else {
        this.logger.error('Sekvenci se nepodařilo odstranit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
