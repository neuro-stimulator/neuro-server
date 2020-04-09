import { Request, Response } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { MessageCodes } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../experiments/experiments.service';
import { ControllerException } from '../../controller-exception';
import { ExperimentResultsService } from '../../experiment-results/experiment-results.service';

@Injectable()
export class ExperimentMiddleware implements NestMiddleware {

  private static readonly REGEX_FULL = /((clear)$)|((upload|setup|run|pause|finish)\/[0-9]+$)/;
  private static readonly REGEX_NO_ID = /(clear)$/;

  private static readonly ERROR_MAP: { [key: string]: {code: number, text: string}; } = {
    upload: {
      code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_UPLOAD_NOT_CLEARED,
      text: 'Experiment nemůže být nahrán, protože v paměti je již jiný experiment!' },
    setup: {
      code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_SETUP_NOT_UPLOADED,
      text: 'Experiment s id: {id} nemůže být inicializován, protože nebyl nahrán do paměti!' },
    run: {
      code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_RUN_NOT_INITIALIZED,
      text: 'Experiment s id: {id} nemůže být spuštěn, protože je aktivní jiný experiment, nebo nebyl inicializován!' },
    pause: {
      code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_PAUSE_NOT_STARTED,
      text: 'Experiment s id: {id} nemůže být pozastaven, protože nebyl spuštěn!' },
    finish: {
      code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_FINISH_NOT_RUNNING,
      text: 'Experiment s id: {id} nemůže být ukončen, protože nebyl spuštěn!' },
    clear: {
      code: MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_CLEAR,
      text: 'Není co mazat!' },
  };

  private readonly logger: Logger = new Logger(ExperimentMiddleware.name);

  constructor(private readonly _experiments: ExperimentsService,
              private readonly _experimentResults: ExperimentResultsService) {
  }

  private _throwError(method: string, id: string) {
    this.logger.error(ExperimentMiddleware.ERROR_MAP[method].text.replace('{id}', id));
    throw new ControllerException(ExperimentMiddleware.ERROR_MAP[method].code, {id});
  }

  use(req: Request, res: Response, next: () => void): any {
    const params: string = req.params[0];
    if (!ExperimentMiddleware.REGEX_FULL.test(params)) {
      this.logger.error(params);
      throw new ControllerException(MessageCodes.CODE_ERROR_COMMANDS_INVALID_URL);
    }

    if (ExperimentMiddleware.REGEX_NO_ID.test(params)) {
      if (this._experimentResults.activeExperimentResult === null) {
        this._throwError(params, '-1');
      }
      next();
      return;
    }

    const [method, id] = params.split('/');

    if (this._experimentResults.activeExperimentResult === null &&
      ( method === 'setup' ||
        method === 'run' ||
        method === 'pause' ||
        method === 'finish')) {
      this._throwError(method, id);
    }

    if (this._experimentResults.activeExperimentResult !== null
      && (this._experimentResults.activeExperimentResult.experimentID !== null
        && (+this._experimentResults.activeExperimentResult.experimentID) !== +id)) {
      this._throwError(method, id);
    }
    next();
    return;
  }

}
