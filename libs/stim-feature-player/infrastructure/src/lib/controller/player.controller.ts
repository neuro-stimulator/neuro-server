import { Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';

import { ExperimentResult, ExperimentStopConditionType, ExperimentType, PlayerConfiguration, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { IsAuthorizedGuard } from '@diplomka-backend/stim-feature-auth/application';
import { UserData, UserGroupsData } from '@diplomka-backend/stim-feature-auth/domain';
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import { AnotherExperimentResultIsInitializedException, UnsupportedExperimentStopConditionException } from '@diplomka-backend/stim-feature-player/domain';

import { PlayerFacade } from '../service/player.facade';

@Controller('/api/player')
export class PlayerController {
  private readonly logger: Logger = new Logger(PlayerController.name);

  constructor(private readonly facade: PlayerFacade) {}

  @Get('state')
  public async getPlayerState(): Promise<ResponseObject<PlayerConfiguration>> {
    this.logger.log('Přišel požadavek na získání stavu přehrávače experimentů.');
    try {
      const state: PlayerConfiguration = await this.facade.getPlayerState();
      this.logger.verbose(state);
      return {
        data: state,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Get('stop-conditions/:experimentType')
  public async getStopConditions(@Param('experimentType') experimentType: ExperimentType): Promise<ResponseObject<ExperimentStopConditionType[]>> {
    this.logger.log('Přišel požadavek na získání zastavovacích podmínek pro zadaný typ experimentu.');
    try {
      const stopConditions: ExperimentStopConditionType[] = await this.facade.getStopConditions(experimentType);
      return {
        data: stopConditions,
      };
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Post('prepare/:id')
  @UseGuards(IsAuthorizedGuard)
  public async prepare(
    @Param('id') experimentID: number,
    @Body() playerConfiguration: PlayerConfiguration,
    @UserData('id') userID: number,
    @UserGroupsData() userGroups: number[])
    : Promise<ResponseObject<ExperimentResult>> {
    this.logger.log('Přišel požadavek na inicializaci přehrávače experimentu.');
    try {
      const experimentResult = await this.facade.prepare(experimentID, playerConfiguration, userID, userGroups);
      return {
        data: experimentResult
      };
    } catch (e) {
      if (e instanceof AnotherExperimentResultIsInitializedException) {
        this.logger.error('Jiný výsledek experimentu je již inicializovaný!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { initializedExperimentResult: e.initializedExperimentResult });
      } else if (e instanceof UnsupportedExperimentStopConditionException) {
        this.logger.error('Byl zadán nepodporovaný typ ukončovací podmínky!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { stopConditionType: e.stopConditionType });
      } else if (e instanceof ExperimentIdNotFoundException) {
        this.logger.error(`Experiment s ID: ${e.experimentID} nebyl nalezen!`);
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.experimentID });
      }
      this.logger.error('Nastala neočekávaná chyba!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }
}
