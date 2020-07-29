import { Body, Controller, Logger, Param, Post } from '@nestjs/common';

import { ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { AnotherExperimentResultIsInitializedException, PlayerConfigurationDTO, UnsupportedExperimentEndConditionException } from '@diplomka-backend/stim-feature-player/domain';

import { PlayerFacade } from '../service/player.facade';

@Controller('/api/player')
export class PlayerController {
  private readonly logger: Logger = new Logger(PlayerController.name);

  constructor(private readonly facade: PlayerFacade) {}

  @Post('prepare/:id/:conditionType')
  public async prepare(
    @Param('id') experimentID: number,
    @Param('conditionType') conditionType: number,
    @Body() playerConfiguration: PlayerConfigurationDTO
  ): Promise<ResponseObject<any>> {
    this.logger.log('Přišel požadavek na inicializaci přehrávače experimentu.');
    try {
      await this.facade.prepare(experimentID, +conditionType, playerConfiguration);
      return {};
    } catch (e) {
      if (e instanceof AnotherExperimentResultIsInitializedException) {
        const error = e as AnotherExperimentResultIsInitializedException;
        this.logger.error('Jiný výsledek experimentu je již inicializovaný!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { initializedExperimentResult: error.initializedExperimentResult });
      } else if (e instanceof UnsupportedExperimentEndConditionException) {
        const error = e as UnsupportedExperimentEndConditionException;
        this.logger.error('Byl zadán nepodporovaný typ ukončovací podmínky!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { experimentEndConditionType: error.experimentEndConditionType });
      }
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }
}
