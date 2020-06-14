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
import { ExperimentsFacade } from '../service/experiments.facade';
import {
  ExperimentWasNotCreatedError,
  ExperimentWasNotDeletedError,
  ExperimentWasNotUpdatedError,
} from '../../domain/exception';

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
    try {
      const experiments = await this.facade.experimentsAll();
      return {
        data: experiments,
      };
    } catch (e) {
      return {};
    }
  }

  @Get('name-exists/:name/:id')
  public async nameExists(
    @Param() params: { name: string; id: number | 'new' }
  ): Promise<ResponseObject<{ exists: boolean }>> {
    return { data: { exists: true } };
    // const exists = await this._service.nameExists(params.name, params.id);
    // return {data: { exists }};
  }

  @Get('multimedia/:id')
  public async usedOutputMultimedia(
    @Param() params: { id: number }
  ): Promise<ResponseObject<{ audio: {}; image: {} }>> {
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
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Get(':id')
  public async experimentById(
    @Param() params: { id: number }
  ): Promise<ResponseObject<Experiment>> {
    try {
      const experiment = await this.facade.experimentsByID(params.id);
      return {
        data: experiment,
      };
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
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
    try {
      const experimentID = await this.facade.insert(body);
      const experiment: Experiment = await this.facade.experimentsByID(
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
          console.log(error.error);
        } else {
          console.log('Experiment se nepodařilo vytvořit z neznámého důvodu!');
        }
      }
      return {
        message: {
          code: 10301,
        },
      };
    }
  }

  @Patch()
  public async update(
    @Body() body: Experiment
  ): Promise<ResponseObject<Experiment>> {
    try {
      await this.facade.update(body);
      const experiment: Experiment = await this.facade.experimentsByID(body.id);
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
      if (e instanceof ExperimentIdNotFoundError) {
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else if (e instanceof ExperimentWasNotUpdatedError) {
        const error = e as ExperimentWasNotUpdatedError;
        if (error.error) {
          console.log(error.error);
        } else {
          console.log(
            'Experiment se nepodařilo aktualizovat z neznámého důvodu!'
          );
        }
      }
      return {
        message: {
          code: 10302,
        },
      };
    }
  }

  @Delete(':id')
  public async delete(
    @Param() params: { id: number }
  ): Promise<ResponseObject<Experiment>> {
    try {
      const experiment: Experiment = await this.facade.experimentsByID(
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
        return {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          },
        };
      } else if (e instanceof ExperimentWasNotDeletedError) {
        const error = e as ExperimentWasNotDeletedError;
        if (error.error) {
          console.log(error.error);
        } else {
          console.log('Experiment se nepodařilo odstranit z neznámého důvodu!');
        }
        return {
          message: {
            code: 10303,
          },
        };
      }
    }
  }
}
