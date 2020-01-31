import { Request, Response } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { MessageCodes } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../experiments/experiments.service';
import { ControllerException } from '../../controller-exception';

@Injectable()
export class ExperimentMiddleware implements NestMiddleware {

  private static readonly REGEX_FULL = /((clear)$)|((upload|setup|start|stop)\/[0-9]+$)/;
  private static readonly REGEX_NO_ID = /(clear)$/;

  private static readonly ERROR_MAP: { [key: string]: {code: number, text: string}; } = {
    upload: {
      code: MessageCodes.CODE_COMMANDS_EXPERIMENT_UPLOAD,
      text: 'Experiment nemůže být inicializován, protože nebyl nahrán do paměti!' },
    setup: {
      code: MessageCodes.CODE_COMMANDS_EXPERIMENT_SETUP,
      text: 'Experiment s id: {id} nemůže být nahrán, protože v paměti je již jiný experiment!' },
    start: {
      code: MessageCodes.CODE_COMMANDS_EXPERIMENT_START,
      text: 'Experiment s id: {id} nemůže být spuštěn, protože je aktivní jiný experiment, nebo nebyl inicializován!' },
    stop: {
      code: MessageCodes.CODE_COMMANDS_EXPERIMENT_STOP,
      text: 'Experiment s id: {id} nemůže být zastaven, protože nebyl spuštěn!' },
    clear: {
      code: MessageCodes.CODE_COMMANDS_EXPERIMENT_CLEAR,
      text: 'Není co mazat!' },
  };

  private readonly logger: Logger = new Logger(ExperimentMiddleware.name);

  constructor(private readonly _experiments: ExperimentsService) {
  }

  private _throwError(method: string, id: string) {
    this.logger.error(ExperimentMiddleware.ERROR_MAP[method].text.replace('{id}', id));
    throw new ControllerException(ExperimentMiddleware.ERROR_MAP[method].code, {id});
  }

  use(req: Request, res: Response, next: () => void): any {
    const params: string = req.params[0];
    if (!ExperimentMiddleware.REGEX_FULL.test(params)) {
      this.logger.error(params);
      throw new ControllerException(MessageCodes.CODE_COMMANDS_INVALID_URL);
    }

    if (ExperimentMiddleware.REGEX_NO_ID.test(params)) {
      if (this._experiments.experimentResult === null) {
        this._throwError(params, '-1');
        return;
      }
      next();
      return;
    }

    const [method, id] = params.split('/');

    if (this._experiments.experimentResult === null && (method === 'start' || method === 'stop')) {
      this._throwError(method, id);
    }

    if (this._experiments.experimentResult !== null
      && (this._experiments.experimentResult.experimentID !== null
        && (+this._experiments.experimentResult.experimentID) !== +id)) {
      this._throwError(method, id);
    }
    next();
    return;
  }

}
