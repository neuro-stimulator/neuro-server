import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { QueryBus } from '@nestjs/cqrs';

import { MessageCodes } from '@stechy1/diplomka-share';

import { PlayerLocalConfigurationQuery } from '@diplomka-backend/stim-feature-player/application';
import { PlayerLocalConfiguration } from '@diplomka-backend/stim-feature-player/domain';
import { RequestWithUser } from '@diplomka-backend/stim-feature-users/domain';
import { ControllerException } from '@diplomka-backend/stim-lib-common';

import { StimulatorFacade } from '../service/stimulator.facade';

/**
 * Pomocný hlídač, který včasně zakáže spustit neočekávanou akci na stimulátoru
 */
@Injectable()
export class StimulatorActionGuard implements CanActivate {
  private static readonly ALLOWED_METHOD_STATE_MAP: { upload: boolean; setup: boolean; run: boolean; pause: boolean; finish: boolean; clear: boolean }[] = [
    { upload: true, setup: false, run: false, pause: false, finish: false, clear: false }, // ready
    { upload: false, setup: true, run: false, pause: false, finish: false, clear: true }, // upload
    { upload: false, setup: false, run: true, pause: false, finish: false, clear: true }, // setup
    { upload: false, setup: false, run: false, pause: true, finish: true, clear: false }, // run
    { upload: false, setup: false, run: true, pause: false, finish: false, clear: false }, // pause
    { upload: false, setup: false, run: false, pause: false, finish: false, clear: true }, // finish
    { upload: true, setup: false, run: false, pause: false, finish: false, clear: false }, // clear
  ];

  private readonly logger: Logger = new Logger(StimulatorActionGuard.name);

  constructor(private readonly facade: StimulatorFacade, private readonly queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose('Ověřuji požadavek na akci se stimulátorem.');
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: RequestWithUser = ctx.getRequest<RequestWithUser>();
    const action: string = req.params['action'];
    const userID = req.user['id'];

    const lastKnowStimulatorState = await this.facade.getLastKnowStimulatorState();
    const playerLocalConfiguration: PlayerLocalConfiguration = await this.queryBus.execute(new PlayerLocalConfigurationQuery());
    this.logger.verbose(`Poslední známý stav je: {lastKnowStimulatorState=${lastKnowStimulatorState}}`);

    if (!playerLocalConfiguration.initialized) {
      this.logger.error('Není možné vykonat žádnou akci na stimulátoru, protože nebyl inicializován přehrávač!');
      await this.facade.getState(false);
      throw new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_PLAYER_NOT_INITIALIZED);
    }

    if (userID !== playerLocalConfiguration.userID) {
      this.logger.error('Neočekávaný uživatel se pokouší vyvolat akci na stimulátoru!');
      throw new ControllerException(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED);
    }

    if (!StimulatorActionGuard.ALLOWED_METHOD_STATE_MAP[lastKnowStimulatorState][action]) {
      this.logger.error(`Akci: '${action}' není možné v aktuálním stavu provést!`);
      throw new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_ACTION_NOT_POSSIBLE);
    }

    this.logger.verbose(`Akci: ${action} je možné provést.`);
    return true;
  }
}
