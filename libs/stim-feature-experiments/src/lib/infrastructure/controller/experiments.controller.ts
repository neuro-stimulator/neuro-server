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
  Experiment,
  MessageCodes,
  ResponseObject,
} from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundError } from '../../domain/exception/experiment-id-not-found.error';
import { ExperimentWasNotCreatedError } from '../../domain/exception/experiment-was-not-created.error';
import { ExperimentWasNotUpdatedError } from '../../domain/exception/experiment-was-not-updated.error';
import { ExperimentWasNotDeletedError } from '../../domain/exception/experiment-was-not-deleted.error';
import { ExperimentsFacade } from '../service/experiments.facade';

@Controller('/api/experiments')
export class ExperimentsController {
  private readonly logger = new Logger(ExperimentsController.name);

  constructor(private readonly facade: ExperimentsFacade) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get()
  public async all(): Promise<ResponseObject<Experiment[]>> {
    this.logger.log('Přišel požadavek na získání všech experimentů.');
    try {
      const experiments = await this.facade.experimentsAll();
      return {
        data: experiments,
      };
    } catch (e) {
      this.logger.error(
        'Nastala neočekávaná chyba při získávání všech experimentů!'
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

  @Get('multimedia/:id')
  public async usedOutputMultimedia(
    @Param() params: { id: number }
  ): Promise<ResponseObject<{ audio: {}; image: {} }>> {
    this.logger.log(
      'Přišel požadavek na získání použitých multimédií v experimentu.'
    );
    try {
      const multimedia: {
        audio: {};
        image: {};
      } = await this.facade.usedOutputMultimedia(params.id);
      return {
        data: multimedia,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else {
        this.logger.error(
          'Nastala neočekávaná chyba při hledání použitých multimédií pro experiment!'
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

  @Get('validate/:id')
  public async validate(
    @Param() params: { id: number }
  ): Promise<ResponseObject<boolean>> {
    this.logger.log('Přišel požadavek na validaci experimentu.');
    try {
      const experiment: Experiment = await this.facade.experimentByID(
        params.id
      );
      const valid = await this.facade.validate(experiment);

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
  public async experimentById(
    @Param() params: { id: number }
  ): Promise<ResponseObject<Experiment>> {
    this.logger.log('Přišel požadavek na získání experimentu podle ID.');
    try {
      const experiment = await this.facade.experimentByID(params.id);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else {
        this.logger.error('Nastala neočekávaná chyba při hledání experimentu!');
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
    @Body() body: Experiment
  ): Promise<ResponseObject<Experiment>> {
    this.logger.log('Přišel požadavek na vložení nového experimentu.');
    try {
      const experimentID = await this.facade.insert(body);
      const experiment: Experiment = await this.facade.experimentByID(
        experimentID
      );
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
      if (e instanceof ExperimentWasNotCreatedError) {
        const error = e as ExperimentWasNotCreatedError;
        if (error.error) {
          this.logger.error('Experiment se nepodařilo vytvořit!');
          this.logger.error(error.error);
          return {
            message: {
              code: 10301,
            },
          };
        }
      } else {
        this.logger.error(
          'Experiment se nepodařilo vytvořit z neznámého důvodu!'
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
    @Body() body: Experiment
  ): Promise<ResponseObject<Experiment>> {
    this.logger.log('Přišel požadavek na aktualizaci experimentu.');
    try {
      await this.facade.update(body);
      const experiment: Experiment = await this.facade.experimentByID(body.id);
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
      if (e instanceof ExperimentIdNotFoundError) {
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else if (e instanceof ExperimentWasNotUpdatedError) {
        const error = e as ExperimentWasNotUpdatedError;
        if (error.error) {
          this.logger.error('Experiment se nepodařilo aktualizovat!');
          this.logger.error(error.error);
          return {
            message: {
              code: 10302,
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
  ): Promise<ResponseObject<Experiment>> {
    this.logger.log('Přišel požadavek na smazání experimentu.');
    try {
      const experiment: Experiment = await this.facade.experimentByID(
        params.id
      );
      await this.facade.delete(params.id);
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
      if (e instanceof ExperimentIdNotFoundError) {
        this.logger.warn('Experiment nebyl nalezen.');
        this.logger.warn(e);
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else if (e instanceof ExperimentWasNotDeletedError) {
        const error = e as ExperimentWasNotDeletedError;
        if (error.error) {
          this.logger.error('Experiment se nepodařilo odstranit!');
          this.logger.error(error.error);
          return {
            message: {
              code: 10303,
            },
          };
        } else {
          this.logger.error(
            'Experiment se nepodařilo odstranit z neznámého důvodu!'
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
