import { Body, Controller, Logger, Param, Post } from '@nestjs/common';

import { ExperimentType, ResponseObject } from '@stechy1/diplomka-share';

import { PlayerFacade } from '../service/player.facade';
import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { AnotherExperimentResultIsInitializedException } from '@diplomka-backend/stim-feature-player/domain';

@Controller('/api/player')
export class PlayerController {
  private readonly logger: Logger = new Logger(PlayerController.name);

  constructor(private readonly facade: PlayerFacade) {}

  @Post('prepare/:id')
  public async prepare(@Param('id') experimentID: number, @Body() options): Promise<ResponseObject<any>> {
    this.logger.log('Přišel požadavek na inicializaci přehrávače experimentu.');
    try {
      await this.facade.prepare(experimentID, options);
      return {};
    } catch (e) {
      if (e instanceof AnotherExperimentResultIsInitializedException) {
        const error = e as AnotherExperimentResultIsInitializedException;
        this.logger.error('Jiný výsledek experimentu je již inicializovaný!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { initializedExperimentResult: error.initializedExperimentResult });
      }
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }
}
