import { ReadStream } from 'fs';
import { Response } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Options,
  Param,
  Patch,
  Res,
} from '@nestjs/common';

import {
  Experiment,
  ExperimentResult,
  MessageCodes,
  ResponseObject,
} from '@stechy1/diplomka-share';

import { FileNotFoundException } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentResultIdNotFoundError } from '../../domain/exception/experiment-result-id-not-found.error';
import { ExperimentResultWasNotUpdatedError } from '../../domain/exception/experiment-result-was-not-updated.error';
import { ExperimentResultWasNotDeletedError } from '../../domain/exception/experiment-result-was-not-deleted.error';
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
    try {
      const experimentResults = await this.facade.experimentResultsAll();
      return {
        data: experimentResults,
      };
    } catch (e) {
      this.logger.error(
        'Nastala neočekávaná chyba při získávání všech výsledků experimentů!'
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
    @Param() params: { name: string; id: number }
  ): Promise<ResponseObject<{ exists: boolean }>> {
    return { data: { exists: true } };
  }

  @Get('validate/:id')
  public async validate(
    @Param() params: { id: number }
  ): Promise<ResponseObject<boolean>> {
    try {
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(
        params.id
      );
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
  public async experimentResultById(
    @Param() params: { id: number }
  ): Promise<ResponseObject<ExperimentResult>> {
    try {
      const experiment = await this.facade.experimentResultByID(params.id);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundError) {
        this.logger.warn('Výsledek experimentu nebyl nalezen.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND,
          },
        };
      } else {
        this.logger.error(
          'Nastala neočekávaná chyba při hledání výsledku experimentu!'
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

  @Get('result-data/:id')
  public async resultData(
    @Param() params: { id: number },
    @Res() response: Response
  ): Promise<ResponseObject<any>> {
    try {
      const content: ReadStream | string = await this.facade.resultData(
        params.id
      );
      if (typeof content === 'string') {
        response.sendFile(content);
      } else if (content instanceof ReadStream) {
        content.pipe(response);
      } else {
        response.json({ data: content });
      }
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        this.logger.error('Soubor nebyl nalezen!!!');
        this.logger.error(e);
        // TODO odeslat správnou chybovou hlášku
      } else if (e instanceof ExperimentResultIdNotFoundError) {
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND,
          },
        };
      } else {
        this.logger.error(
          'Nastala neočekávaná chyba při získávání dat výsledku experimentu!'
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
    @Body() body: ExperimentResult
  ): Promise<ResponseObject<ExperimentResult>> {
    try {
      await this.facade.update(body);
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(
        body.id
      );
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
      if (e instanceof ExperimentResultIdNotFoundError) {
        this.logger.warn('Výsledek experimentu nebyl nalezen.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND,
          },
        };
      } else if (e instanceof ExperimentResultWasNotUpdatedError) {
        const error = e as ExperimentResultWasNotUpdatedError;
        if (error.error) {
          this.logger.error('Výsledek experimentu se nepodařilo aktualizovat!');
          this.logger.error(e);
          return {
            message: {
              code: 20302,
            },
          };
        }
      } else {
        this.logger.error(
          'Experiment se nepodařilo aktualizovat z neznámého důvodu!'
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
  ): Promise<ResponseObject<ExperimentResult>> {
    try {
      const experimentResult: ExperimentResult = await this.facade.experimentResultByID(
        params.id
      );
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
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else if (e instanceof ExperimentResultWasNotDeletedError) {
        const error = e as ExperimentResultWasNotDeletedError;
        if (error.error) {
          this.logger.error('Výsledek experimentu se nepodařilo odstranit!');
          this.logger.error(error.error);
          return {
            message: {
              code: 20303,
            },
          };
        } else {
          this.logger.error(
            'Výsledek experimentu se nepodařilo odstranit z neznámého důvodu!'
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
}
