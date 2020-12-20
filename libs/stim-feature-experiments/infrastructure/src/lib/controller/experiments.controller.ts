import { Body, Controller, Delete, Get, Logger, Options, Param, ParseBoolPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { Experiment, ExperimentAssets, MessageCodes, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException, ExperimentDtoNotFoundException } from '@diplomka-backend/stim-lib-common';
import {
  ExperimentNotValidException,
  ExperimentIdNotFoundException,
  ExperimentWasNotCreatedException,
  ExperimentWasNotUpdatedException,
  ExperimentWasNotDeletedException,
} from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentDoNotSupportSequencesException, SequenceIdNotFoundException, SequenceWasNotCreatedException } from '@diplomka-backend/stim-feature-sequences/domain';
import { IsAuthorizedGuard } from '@diplomka-backend/stim-feature-auth/application';
import { UserData } from '@diplomka-backend/stim-feature-auth/domain';
import { IpcOutputSynchronizationExperimentIdMissingException, NoIpcOpenException } from '@diplomka-backend/stim-feature-ipc/domain';

import { ExperimentsFacade } from '../service/experiments.facade';

@Controller('/api/experiments')
export class ExperimentsController {
  private readonly logger = new Logger(ExperimentsController.name);

  constructor(private readonly facade: ExperimentsFacade) {}

  @Options('')
  public async optionsEmpty(): Promise<string> {
    return '';
  }

  @Options('*')
  public async optionsWildcard(): Promise<string> {
    return '';
  }

  @Get()
  public async all(@UserData('id') userID?: number): Promise<ResponseObject<Experiment<Output>[]>> {
    this.logger.log('Přišel požadavek na získání všech experimentů.');
    try {
      const experiments = await this.facade.experimentsAll(userID);
      return {
        data: experiments,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání všech experimentů!');
      this.logger.error(e);
      throw new ControllerException();
    }
  }

  @Get('name-exists/:name/:id')
  public async nameExists(@Param() params: { name: string; id: number | 'new' }): Promise<ResponseObject<{ exists: boolean }>> {
    this.logger.log('Přišel požadavek na ověření existence názvu experimentu.');
    const exists = await this.facade.nameExists(params.name, params.id);
    return { data: { exists } };
  }

  @Get('multimedia/:id')
  public async usedOutputMultimedia(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<ExperimentAssets>> {
    this.logger.log('Přišel požadavek na získání použitých multimédií v experimentu.');
    try {
      const multimedia: ExperimentAssets = await this.facade.usedOutputMultimedia(params.id, userID);
      return {
        data: multimedia,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání použitých multimédií pro experiment!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get('validate')
  public async validate(@Body() body: Experiment<Output>): Promise<ResponseObject<boolean>> {
    this.logger.log('Přišel požadavek na validaci experimentu.');
    try {
      await this.facade.validate(body);

      return { data: true };
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        const error = e as ExperimentNotValidException;
        this.logger.error('Kontrolovaný experiment není validní!');
        this.logger.error(error);
        return { data: false };
      } else {
        this.logger.error('Nastala neočekávaná chyba!');
        this.logger.error(e.message);
      }
    }
    throw new ControllerException();
  }

  @Get('sequences-for-experiment/:id')
  public async sequencesForExperiment(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí pro zadaný experiment.');
    try {
      const sequences: Sequence[] = await this.facade.sequencesForExperiment(params.id, userID);
      return {
        data: sequences,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání sekvencí pro zadaný experiment!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Get('sequence-from-experiment/:id/:name/:size')
  public async sequenceFromExperiment(@Param() params: { id: number; name: string; size: number }, @UserData('id') userID: number): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek pro rychlé vygenerování sekvence na základě jména a velikosti.');
    try {
      const sequenceID: number = await this.facade.sequenceFromExperiment(+params.id, params.name, +params.size, userID);
      const sequence: Sequence = await this.facade.sequenceById(sequenceID, userID);
      return {
        data: sequence,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.error('Experiment nebyl nalezen!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof SequenceIdNotFoundException) {
        const error = e as SequenceIdNotFoundException;
        this.logger.error('Sekvence nebyla nalezena!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.sequenceID });
      } else if (e instanceof ExperimentDoNotSupportSequencesException) {
        const error = e as ExperimentDoNotSupportSequencesException;
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof SequenceWasNotCreatedException) {
        const error = e as SequenceWasNotCreatedException;
        this.logger.error('Nastala chyba při generování nové sekvence!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { sequence: error.sequence });
      } else {
        this.logger.error('Nastala neočekávaná chyba při generování sekvence!');
        this.logger.error(e.message);
        throw new ControllerException();
      }
    }
  }

  @Get(':id')
  public async experimentById(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na získání experimentu podle ID.');
    try {
      const experiment = await this.facade.experimentByID(params.id, userID);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání experimentu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Post()
  @UseGuards(IsAuthorizedGuard)
  public async insert(@Body() body: Experiment<Output>, @UserData('id') userID: number): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na vložení nového experimentu.');
    try {
      const experimentID = await this.facade.insert(body, userID);
      const experiment: Experiment<Output> = await this.facade.experimentByID(experimentID, userID);
      return {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
          params: {
            id: experiment.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        const error = e as ExperimentNotValidException;
        this.logger.error('Vkládaný experiment není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, error.errors);
      } else if (e instanceof ExperimentWasNotCreatedException) {
        const error = e as ExperimentWasNotCreatedException;
        this.logger.error('Experiment se nepodařilo vytvořit!');
        if (error.error) {
          this.logger.error('Nastala chyba při vykonávání SQL dotazu!');
          this.logger.error(error.error);
        }
        throw new ControllerException(error.errorCode);
      } else if (e instanceof ExperimentDtoNotFoundException) {
        const error = e as ExperimentDtoNotFoundException;
        this.logger.error('Nebyl nalezen DTO objekt experimentu!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Experiment se nepodařilo vytvořit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  @UseGuards(IsAuthorizedGuard)
  public async update(@Body() body: Experiment<Output>, @UserData('id') userID: number): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na aktualizaci experimentu.');
    try {
      await this.facade.update(body, userID);
      const experiment: Experiment<Output> = await this.facade.experimentByID(body.id, userID);
      return {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
          params: {
            id: experiment.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        const error = e as ExperimentNotValidException;
        this.logger.error('Aktualizovaný experiment není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, error.errors);
      } else if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof ExperimentWasNotUpdatedException) {
        const error = e as ExperimentWasNotUpdatedException;
        this.logger.error('Experiment se nepodařilo aktualizovat!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experiment.id });
      } else {
        this.logger.error('Experiment se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Delete(':id')
  @UseGuards(IsAuthorizedGuard)
  public async delete(@Param() params: { id: number }, @UserData('id') userID: number): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na smazání experimentu.');
    try {
      const experiment: Experiment<Output> = await this.facade.experimentByID(params.id, userID);
      await this.facade.delete(params.id, userID);
      return {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
          params: {
            id: experiment.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else if (e instanceof ExperimentWasNotDeletedException) {
        const error = e as ExperimentWasNotDeletedException;
        this.logger.error('Experiment se nepodařilo odstranit!');
        if (error.error) {
          this.logger.error(error.error);
        }
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      } else {
        this.logger.error('Experiment se nepodařilo odstranit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('set-output-synchronization')
  @UseGuards(IsAuthorizedGuard)
  public async setOutputSynchronization(
    @UserData('id') userID: number,
    @Query('synchronize', new ParseBoolPipe({ errorHttpStatusCode: 200, exceptionFactory: () => new ControllerException(987564) })) synchronize: boolean,
    @Query('experimentID') experimentID?: number
  ): Promise<ResponseObject<void>> {
    try {
      await this.facade.setOutputSynchronization(synchronize, userID, +experimentID);
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      if (e instanceof NoIpcOpenException) {
        const error = e as NoIpcOpenException;
        this.logger.error('Není vytvořeno žádné spojení s přehrávačem multimédií!');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof IpcOutputSynchronizationExperimentIdMissingException) {
        const error = e as IpcOutputSynchronizationExperimentIdMissingException;
        this.logger.error('Uživatel se snaží zapnout synchronizaci, ale neodesílá ID experimentu!');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při přepínání synchronizace obrázků s přehrávačem multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
