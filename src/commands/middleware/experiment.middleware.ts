import { Request, Response } from 'express';
import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { ResponseMessageType } from 'diplomka-share';

import { ExperimentsService } from '../../experiments/experiments.service';

@Injectable()
export class ExperimentMiddleware implements NestMiddleware {

  private static readonly REGEX_FULL = /((init|clear)$)|((setup|start|stop)\/[0-9]+$)/;
  private static readonly REGEX_NO_ID = /(init|clear)$/;
  
  private static readonly ERROR_MAP: { [key: string]: string; } = {
    setup: 'Experiment s id: {id} nemůže být nahrán, protože v paměti je již jiný experiment!',
    start: 'Experiment s id: {id} nemůže být spuštěn, protože je aktivní jiný experiment, nebo nebyl inicializován!',
    stop: 'Experiment s id: {id} nemůže být zastaven, protože nebyl spuštěn!'
  };

  private readonly logger: Logger = new Logger(ExperimentMiddleware.name);

  constructor(private readonly _experiments: ExperimentsService) {
  }

  private _throwError(method: string, id: string) {
    this.logger.error(ExperimentMiddleware.ERROR_MAP[method].replace('{id}', id));
    throw new HttpException({
      message: {
        text: ExperimentMiddleware.ERROR_MAP[method].replace('{id}', id),
        type: ResponseMessageType.ERROR,
      },
    }, HttpStatus.OK);
  }

  use(req: Request, res: Response, next: () => void): any {
    const params: string = req.params[0];
    if (!ExperimentMiddleware.REGEX_FULL.test(params)) {
      throw new HttpException({
            message: {
              text: `URL adresa není ve správném formátu!!!`,
              type: ResponseMessageType.ERROR,
            },
          }, HttpStatus.OK);
    }

    if (ExperimentMiddleware.REGEX_NO_ID.test(params)) {
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





    // this.logger.debug(req.params);
    // throw new HttpException({
    //   message: {
    //     text: `Experiment s id: nemůže být zastaven, protože nebyl spuštěn!`,
    //     type: 3,
    //   },
    // }, HttpStatus.OK);
  }

}
