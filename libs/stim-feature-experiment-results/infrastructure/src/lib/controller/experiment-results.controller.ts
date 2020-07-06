import { Body, Controller, Delete, Get, Logger, Options, Param, Patch } from '@nestjs/common';

import { ExperimentResult, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { FileNotFoundException } from '@diplomka-backend/stim-feature-file-browser';
import {
  ExperimentResultIdNotFoundError,
  ExperimentResultWasNotUpdatedError,
  ExperimentResultWasNotDeletedError,
  ExperimentResultNotValidException,
} from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsFacade } from '../service/experiment-results.facade';

@Controller('api/experiment-results')
export class ExperimentResultsController {
  private readonly logger = new Logger(ExperimentResultsController.name);

  constructor(private readonly facade: ExperimentResultsFacade) {}

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
    this.logger.log('Přišel požadavek na získání všech výsledků experimentů.');
    try {
      const experimentResults = await this.facade.experimentResultsAll();
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

  @Get('validate/:id')
  public async validate(@Param() params: { id: number }): Promise<ResponseObject<boolean>> {
    this.logger.log('Přišel požadavek na validaci výsledku experimentu.');
    try {
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(params.id);
      const valid = await this.facade.validate(experimentResult);

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
  public async experimentResultById(@Param() params: { id: number }): Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na získání výsledku experimentu podle ID.');
    try {
      const experiment = await this.facade.experimentResultByID(params.id);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundError) {
        const error = e as ExperimentResultIdNotFoundError;
        this.logger.warn('Výsledek experimentu nebyl nalezen.');
        this.logger.warn(e);
        throw new ControllerException(error.errorCode, { id: error.experimentResultID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání výsledku experimentu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get('result-data/:id')
  public async resultData(@Param() params: { id: number }): Promise<any> {
    this.logger.log('Přišel požadavek na získání dat výsledku experimentu podle ID.');
    try {
      return await this.facade.resultData(params.id);
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        const error = e as FileNotFoundException;
        this.logger.error('Soubor nebyl nalezen!!!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { path: error.path });
      } else if (e instanceof ExperimentResultIdNotFoundError) {
        const error = e as ExperimentResultIdNotFoundError;
        this.logger.error('Výsledek experimentu nebyl nalezen!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentResultID });
      } else {
        this.logger.error('Nastala neočekávaná chyba při získávání dat výsledku experimentu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  public async update(@Body() body: ExperimentResult): Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na aktualizaci výsledku experimentu.');
    try {
      await this.facade.update(body);
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(body.id);
      return {
        data: experimentResult,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATED,
          params: {
            id: experimentResult.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        const error = e as ExperimentResultNotValidException;
        this.logger.error('Aktualizovaný experiment není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof ExperimentResultIdNotFoundError) {
        const errror = e as ExperimentResultIdNotFoundError;
        this.logger.warn('Výsledek experimentu nebyl nalezen!');
        this.logger.warn(e);
        throw new ControllerException(errror.errorCode, { id: errror.experimentResultID });
      } else if (e instanceof ExperimentResultWasNotUpdatedError) {
        const error = e as ExperimentResultWasNotUpdatedError;
        this.logger.error('Výsledek experimentu se nepodařilo aktualizovat!');
        if (error.error) {
          this.logger.error(e);
        }
        throw new ControllerException(error.errorCode, { id: error.experimentResult.id });
      } else {
        this.logger.error('Experiment se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Delete(':id')
  public async delete(@Param() params: { id: number }): Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na smazání výsledku experimentu.');
    try {
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(params.id);
      await this.facade.delete(params.id);
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
      if (e instanceof ExperimentResultIdNotFoundError) {
        const errror = e as ExperimentResultIdNotFoundError;
        this.logger.warn('Výsledek experimentu nebyl nalezen!');
        this.logger.warn(e);
        throw new ControllerException(errror.errorCode, { id: errror.experimentResultID });
      } else if (e instanceof ExperimentResultWasNotDeletedError) {
        const error = e as ExperimentResultWasNotDeletedError;
        this.logger.error('Výsledek experimentu se nepodařilo odstranit!');
        if (error.error) {
          this.logger.error(error.error);
        }
        throw new ControllerException(error.errorCode, { id: error.experimentResultID });
      } else {
        this.logger.error('Výsledek experimentu se nepodařilo odstranit z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
