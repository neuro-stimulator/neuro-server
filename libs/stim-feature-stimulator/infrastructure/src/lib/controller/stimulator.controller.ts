import { Body, Controller, DefaultValuePipe, Get, Logger, Options, Param, ParseBoolPipe, Patch, Query, UseGuards } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';
import { UserGroupsData } from '@neuro-server/stim-feature-auth/domain';
import { FileAccessRestrictedException, FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';
import {
  FirmwareUpdateFailedException,
  StimulatorActionType,
  StimulatorStateData,
  PortIsNotOpenException,
  UnknownStimulatorActionTypeException,
} from '@neuro-server/stim-feature-stimulator/domain';
import { ControllerException } from '@neuro-server/stim-lib-common';

import { StimulatorActionGuard } from '../guard/stimulator-action.guard';
import { StimulatorFacade } from '../service/stimulator.facade';

@Controller('/api/stimulator')
export class StimulatorController {
  private readonly logger: Logger = new Logger(StimulatorController.name);

  constructor(private readonly stimulator: StimulatorFacade) {}

  @Options('')
  public async optionsEmpty(): Promise<string> {
    return '';
  }

  @Options('*')
  public async optionsWildcard(): Promise<string> {
    return '';
  }

  @UseGuards(IsAuthorizedGuard)
  @Patch('update-firmware')
  public async updateFirmware(
    @Body() body: { path: string }
  ): Promise<ResponseObject<void>> {
    this.logger.log('Přišel požadavek na aktualizaci firmware stimulátoru.');
    try {
      await this.stimulator.updateFirmware(body.path);
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS_LOW_LEVEL_FIRMWARE_UPDATED,
        },
      };
    } catch (e) {
      if (e instanceof FileAccessRestrictedException) {
        this.logger.error('Firmware byl umístěn na nevalidním místě!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { restrictedpath: e.restrictedPath });
      } else if (e instanceof FileNotFoundException) {
        this.logger.error('Firmware nebyl nalezen!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { path: e.path });
      } else if (e instanceof FirmwareUpdateFailedException) {
        this.logger.error('Firmware se nepodařilo aktualizovat!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při aktualizaci firmware!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @UseGuards(IsAuthorizedGuard, StimulatorActionGuard)
  @Patch('experiment/:action/:experimentID?')
  public async experimentAction(
    @Param('action') action: StimulatorActionType,
    @Param('experimentID') experimentID: number,
    @UserGroupsData() userGroups: number[],
    @Query('asyncStimulatorRequest', new DefaultValuePipe(false), ParseBoolPipe) asyncStimulatorRequest: boolean,
    @Query('force', new DefaultValuePipe(false), ParseBoolPipe) force: boolean
  ): Promise<ResponseObject<StimulatorStateData | any>> {
    this.logger.log('Přišel požadavek na vykonání ovládacího příkazu stimulátoru.');
    try {
      const result = await this.stimulator.doAction(action, experimentID, asyncStimulatorRequest || false, force || false, userGroups);
      return {
        data: result,
      };
    } catch (e) {
      if (e instanceof PortIsNotOpenException) {
        this.logger.error('Sériový port není otevřený!');
        throw new ControllerException(e.errorCode);
      } else if (e instanceof UnknownStimulatorActionTypeException) {
        this.logger.error(`Nepodporovaná akce: '${e.action}'!`);
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { action: e.action });
      } else {
        this.logger.error('Nastala neočekávaná chyba při zpracování akce!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Get('state')
  public async getStimulatorState(
    @Query('asyncStimulatorRequest') asyncStimulatorRequest: boolean
  ): Promise<ResponseObject<StimulatorStateData>> {
    this.logger.log('Přišel požadavek na získání aktuálního stavu stimulátoru.');
    try {
      const state = await this.stimulator.getState(asyncStimulatorRequest);
      return {
        data: state,
      };
    } catch (e) {
      if (e instanceof PortIsNotOpenException) {
        this.logger.error('Sériový port není otevřený!');
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při získávání stavu stimulátoru!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @UseGuards(IsAuthorizedGuard)
  @Patch('set-output')
  public async setOutput(
    @Body() body: { index: number; enabled: boolean },
    @Query('asyncStimulatorRequest') asyncStimulatorRequest: boolean
  ): Promise<ResponseObject<void>> {
    try {
      await this.stimulator.setOutput(body.index, body.enabled);
      return {
        message: {
          code: 0,
        },
      };
    } catch (e) {
      if (e instanceof PortIsNotOpenException) {
        this.logger.error('Sériový port není otevřený!');
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při manuálním nastavování jednoho výstupu na stimulátoru!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
