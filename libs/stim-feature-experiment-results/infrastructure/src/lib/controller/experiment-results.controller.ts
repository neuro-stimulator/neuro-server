import { Body, Controller, Delete, Get, Logger, Options, Param, Patch, UseGuards } from '@nestjs/common';

import { ExperimentResult, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { UserGroupsData } from '@neuro-server/stim-feature-auth/domain';
import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';
import {
  ExperimentResultIdNotFoundException,
  ExperimentResultWasNotUpdatedException,
  ExperimentResultWasNotDeletedException,
  ExperimentResultNotValidException,
} from '@neuro-server/stim-feature-experiment-results/domain';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { ExperimentResultsFacade } from '../service/experiment-results.facade';

@Controller('/api/experiment-results')
export class ExperimentResultsController {
  private readonly logger = new Logger(ExperimentResultsController.name);

  constructor(private readonly facade: ExperimentResultsFacade) {}

  @Options('')
  public async optionsEmpty(): Promise<string> {
    return '';
  }

  @Options('*')
  public async optionsWildcard(): Promise<string> {
    return '';
  }

  @Get()
  public async all(@UserGroupsData() userGroups: number[]): Promise<ResponseObject<ExperimentResult[]>> {
    this.logger.log('Přišel požadavek na získání všech výsledků experimentů.');
    try {
      const experimentResults = await this.facade.experimentResultsAll(userGroups);
      return {
        data: experimentResults,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání všech výsledků experimentů!');
      this.logger.error(e);
      throw new ControllerException();
    }
  }

  @Get('name-exists/:name/:id')
  public async nameExists(@Param() params: { name: string; id: number }): Promise<ResponseObject<{ exists: boolean }>> {
    return { data: { exists: await this.facade.nameExists(params.name, params.id) } };
  }

  @Get('validate')
  public async validate(@Body() body: ExperimentResult): Promise<ResponseObject<boolean>> {
    this.logger.log('Přišel požadavek na validaci výsledku experimentu.');
    try {
      const valid = await this.facade.validate(body);

      return { data: valid };
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        this.logger.error('Kontrolovaný výsledek experimentu není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      }
      this.logger.error('Nastala neočekávaná chyba při validaci výsledku experimentu!');
      this.logger.error(e);
    }
    throw new ControllerException();
  }

  @Get(':id')
  public async experimentResultById(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na získání výsledku experimentu podle ID.');
    try {
      const experiment = await this.facade.experimentResultByID(userGroups, params.id);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundException) {
        this.logger.error('Výsledek experimentu nebyl nalezen.');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentResultID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání výsledku experimentu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get('result-data/:id')
  public async resultData(
    @Param() params: { id: number },
    @UserGroupsData() userGroups: number[]
  ): Promise<any> {
    this.logger.log('Přišel požadavek na získání dat výsledku experimentu podle ID.');
    try {
      return await this.facade.resultData(userGroups, params.id);
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        this.logger.error('Soubor nebyl nalezen!!!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { path: e.path });
      } else if (e instanceof ExperimentResultIdNotFoundException) {
        this.logger.error('Výsledek experimentu nebyl nalezen!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentResultID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při získávání dat výsledku experimentu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  @UseGuards(IsAuthorizedGuard)
  public async update(
    @Body() body: ExperimentResult,
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na aktualizaci výsledku experimentu.');
    try {
      const updated = await this.facade.update(userGroups, body);
      let experimentResult: ExperimentResult = body;
      if (updated) {
        experimentResult = await this.facade.experimentResultByID(userGroups, body.id);
      }
      return {
        data: experimentResult,
        message: {
          code: updated
            ? MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATED
            : MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATE_NOT_NECESSARY,
          params: {
            id: experimentResult.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        this.logger.error('Aktualizovaný experiment není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof ExperimentResultIdNotFoundException) {
        this.logger.error('Výsledek experimentu nebyl nalezen!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentResultID });
      } else if (e instanceof ExperimentResultWasNotUpdatedException) {
        this.logger.error('Výsledek experimentu se nepodařilo aktualizovat!');
        if (e.error) {
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode, { id: e.experimentResult.id });
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
    @UserGroupsData() userGroups: number[]
  ): Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na smazání výsledku experimentu.');
    try {
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(userGroups, params.id);
      await this.facade.delete(userGroups, params.id);
      return {
        data: experimentResult,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_DELETED,
          params: {
            id: experimentResult.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundException) {
        this.logger.error('Výsledek experimentu nebyl nalezen!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentResultID });
      } else if (e instanceof ExperimentResultWasNotDeletedException) {
        this.logger.error('Výsledek experimentu se nepodařilo odstranit!');
        if (e.error) {
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode, { id: e.experimentResultID });
      } else {
        this.logger.error('Výsledek experimentu se nepodařilo odstranit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
