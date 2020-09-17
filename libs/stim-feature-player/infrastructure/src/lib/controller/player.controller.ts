import { Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';

import { PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { AnotherExperimentResultIsInitializedException, UnsupportedExperimentStopConditionException } from '@diplomka-backend/stim-feature-player/domain';
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import { IsAuthorizedGuard } from '@diplomka-backend/stim-feature-auth/application';

import { PlayerFacade } from '../service/player.facade';
import { UserData } from '@diplomka-backend/stim-feature-auth/domain';

@Controller('/api/player')
export class PlayerController {
  private readonly logger: Logger = new Logger(PlayerController.name);

  constructor(private readonly facade: PlayerFacade) {}

  @Get('state')
  public async getPlayerState(): Promise<ResponseObject<PlayerConfiguration>> {
    this.logger.log('Přišel požadavek na získání stavu přehrávače experimentů.');
    try {
      const state: PlayerConfiguration = await this.facade.getPlayerState();
      return {
        data: state,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Post('prepare/:id')
  @UseGuards(IsAuthorizedGuard)
  public async prepare(@Param('id') experimentID: number, @Body() playerConfiguration: PlayerConfiguration, @UserData('id') userID: number): Promise<ResponseObject<any>> {
    this.logger.log('Přišel požadavek na inicializaci přehrávače experimentu.');
    try {
      await this.facade.prepare(experimentID, playerConfiguration, userID);
      return {};
    } catch (e) {
      if (e instanceof AnotherExperimentResultIsInitializedException) {
        const error = e as AnotherExperimentResultIsInitializedException;
        this.logger.error('Jiný výsledek experimentu je již inicializovaný!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { initializedExperimentResult: error.initializedExperimentResult });
      } else if (e instanceof UnsupportedExperimentStopConditionException) {
        const error = e as UnsupportedExperimentStopConditionException;
        this.logger.error('Byl zadán nepodporovaný typ ukončovací podmínky!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { stopConditionType: error.stopConditionType });
      } else if (e instanceof ExperimentIdNotFoundException) {
        const error = e as ExperimentIdNotFoundException;
        this.logger.error(`Experiment s ID: ${error.experimentID} nebyl nalezen!`);
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.experimentID });
      }
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }
}
