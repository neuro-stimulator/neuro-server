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
import { UserData, UserGroupsData } from '@diplomka-backend/stim-feature-auth/domain';
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
  public async all(@UserGroupsData() userGroups: number[]): Promise<ResponseObject<Experiment<Output>[]>> {
    this.logger.log('Přišel požadavek na získání všech experimentů.');
    try {
      const experiments = await this.facade.experimentsAll(userGroups);
      return {
        data: experiments,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání všech experimentů!');
      this.logger.error(e.message);
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
  public async usedOutputMultimedia(
    @Param() params: { id: number },
    @UserData('id') userID: number,
    @UserGroupsData() userGroups: number[]): Promise<ResponseObject<ExperimentAssets>> {
    this.logger.log('Přišel požadavek na získání použitých multimédií v experimentu.');
    try {
      const multimedia: ExperimentAssets = await this.facade.usedOutputMultimedia(userGroups, userID);
      return {
        data: multimedia,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        this.logger.error('Experiment nebyl nalezen.');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
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
        this.logger.error('Kontrolovaný experiment není validní!');
        this.logger.error(e);
        return { data: false };
      } else {
        this.logger.error('Nastala neočekávaná chyba!');
        this.logger.error(e.message);
      }
    }
    throw new ControllerException();
  }

  @Get('sequences-for-experiment/:id')
  public async sequencesForExperiment(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence[]>> {
    this.logger.log('Přišel požadavek na získání všech sekvencí pro zadaný experiment.');
    try {
      const sequences: Sequence[] = await this.facade.sequencesForExperiment(userGroups, params.id);
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
  public async sequenceFromExperiment(
    @Param() params: { id: number; name: string; size: number },
    @UserData('id') userID: number,
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<Sequence>> {
    this.logger.log('Přišel požadavek pro rychlé vygenerování sekvence na základě jména a velikosti.');
    try {
      const sequenceID: number = await this.facade.sequenceFromExperiment(userID, userGroups, +params.id, params.name, +params.size);
      const sequence: Sequence = await this.facade.sequenceById(userGroups, sequenceID);
      return {
        data: sequence,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        this.logger.error('Experiment nebyl nalezen!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else if (e instanceof SequenceIdNotFoundException) {
        this.logger.error('Sekvence nebyla nalezena!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.sequenceID });
      } else if (e instanceof ExperimentDoNotSupportSequencesException) {
        this.logger.error('Experiment nepodporuje sekvence!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else if (e instanceof SequenceWasNotCreatedException) {
        this.logger.error('Nastala chyba při generování nové sekvence!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { sequence: e.sequence });
      } else {
        this.logger.error('Nastala neočekávaná chyba při generování sekvence!');
        this.logger.error(e.message);
        throw new ControllerException();
      }
    }
  }

  @Get(':id')
  public async experimentById(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na získání experimentu podle ID.');
    try {
      const experiment = await this.facade.experimentByID(userGroups, params.id);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        this.logger.error('Experiment nebyl nalezen.');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání experimentu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Post()
  @UseGuards(IsAuthorizedGuard)
  public async insert(
    @Body() body: Experiment<Output>,
    @UserData('id') userID: number,
    @UserGroupsData() userGroups: number[]): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na vložení nového experimentu.');
    try {
      const experimentID = await this.facade.insert(body, userID);
      const experiment: Experiment<Output> = await this.facade.experimentByID(userGroups, experimentID);
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
        this.logger.error('Vkládaný experiment není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof ExperimentWasNotCreatedException) {
        this.logger.error('Experiment se nepodařilo vytvořit!');
        if (e.error) {
          this.logger.error('Nastala chyba při vykonávání SQL dotazu!');
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode);
      } else if (e instanceof ExperimentIdNotFoundException) {
        this.logger.error('Vytvořený experiment nebyl nalezen!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else if (e instanceof ExperimentDtoNotFoundException) {
        this.logger.error('Nebyl nalezen DTO objekt experimentu!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Experiment se nepodařilo vytvořit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  @UseGuards(IsAuthorizedGuard)
  public async update(
    @Body() body: Experiment<Output>,
    @UserGroupsData() userGroups: number[]): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na aktualizaci experimentu.');
    try {
      const updated = await this.facade.update(userGroups, body);
      let experiment = body;
      if (updated) {
        experiment = await this.facade.experimentByID(userGroups, body.id);
      }
      return {
        data: experiment,
        message: {
          code: updated
            ? MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED
            : MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATE_NOT_NECESSARY,
          params: {
            id: experiment.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        this.logger.error('Aktualizovaný experiment není validní!');
        this.logger.error(JSON.stringify(e.errors));
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof ExperimentIdNotFoundException) {
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else if (e instanceof ExperimentWasNotUpdatedException) {
        this.logger.error('Experiment se nepodařilo aktualizovat!');
        if (e.error) {
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode, { id: e.experiment.id });
      } else {
        this.logger.error('Experiment se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Delete(':id')
  @UseGuards(IsAuthorizedGuard)
  public async delete(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]): Promise<ResponseObject<Experiment<Output>>> {
    this.logger.log('Přišel požadavek na smazání experimentu.');
    try {
      const experiment: Experiment<Output> = await this.facade.experimentByID(userGroups, params.id);
      await this.facade.delete(userGroups, params.id);
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
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      } else if (e instanceof ExperimentWasNotDeletedException) {
        this.logger.error('Experiment se nepodařilo odstranit!');
        if (e.error) {
          this.logger.error('Nastala chyba při vykonávání SQL dotazu!');
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode, { id: e.experimentID });
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
    @UserGroupsData() userGroups: number[],
    @Query('synchronize', new ParseBoolPipe({ errorHttpStatusCode: 200, exceptionFactory: () => new ControllerException(987564) })) synchronize: boolean,
    @Query('experimentID') experimentID?: number
  ): Promise<ResponseObject<void>> {
    try {
      await this.facade.setOutputSynchronization(synchronize, userGroups, +experimentID);
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      if (e instanceof NoIpcOpenException) {
        this.logger.error('Není vytvořeno žádné spojení s přehrávačem multimédií!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else if (e instanceof IpcOutputSynchronizationExperimentIdMissingException) {
        this.logger.error('Uživatel se snaží zapnout synchronizaci, ale neodesílá ID experimentu!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při přepínání synchronizace obrázků s přehrávačem multimédií!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
