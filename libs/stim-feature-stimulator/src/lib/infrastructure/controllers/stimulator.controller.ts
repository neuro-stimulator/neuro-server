import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Options,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import {
  FileAccessRestrictedException,
  FileNotFoundException,
} from '@diplomka-backend/stim-feature-file-browser';

import { FirmwareUpdateFailedException } from '../../domain/exception/firmware-update-failed.exception';
import { StimulatorActionType } from '../../domain/model/stimulator-action-type';
import { StimulatorStateData } from '../../domain/model/stimulator-command-data/stimulator-state.data';
import { PortIsNotOpenException } from '../../domain/exception/port-is-not-open.exception';
import { UnknownStimulatorActionTypeException } from '../../domain/exception/unknown-stimulator-action-type.exception';
import { StimulatorFacade } from '../service/stimulator.facade';

@Controller('/api/stimulator')
export class StimulatorController {
  private readonly logger: Logger = new Logger(StimulatorController.name);

  constructor(private readonly stimulator: StimulatorFacade) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

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
      } else if (e instanceof FileNotFoundException) {
        this.logger.error('Firmware nebyl nalezen!');
      } else if (e instanceof FirmwareUpdateFailedException) {
        this.logger.error('Firmware se nepodařilo aktualizovat!');
        return {
          message: {
            code: MessageCodes.CODE_ERROR_LOW_LEVEL_FIRMWARE_NOT_UPDATED,
          },
        };
      } else {
        this.logger.error(
          'Nastala neočekávaná chyba při aktualizaci firmware!'
        );
      }
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
      // TODO error handling
    }
  }

  @Patch('experiment/:action/:experimentID?')
  // TODO interceptor pro oveření, že je možné akci vykonat (validita)
  public async experimentAction(
    @Param('action') action: StimulatorActionType,
    @Param('experimentID') experimentID: number,
    @Query('asyncStimulatorRequest') asyncStimulatorRequest: boolean
  ): Promise<ResponseObject<StimulatorStateData | any>> {
    this.logger.log(
      'Přišel požadavek na vykonání ovládacího příkazu stimulátoru.'
    );
    this.logger.debug(
      `Budu čekat na odpověď stimulátoru: ${asyncStimulatorRequest}.`
    );
    try {
      const result = await this.stimulator.doAction(
        action,
        experimentID,
        asyncStimulatorRequest || false
      );
      return {
        data: result,
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      if (e instanceof PortIsNotOpenException) {
        this.logger.error('Sériový port není otevřený!');
        return {
          message: {
            code: 10000000,
          },
        };
      } else if (e instanceof UnknownStimulatorActionTypeException) {
        const error = e as UnknownStimulatorActionTypeException;
        this.logger.error(`Nepodporovaná akce: '${error.action}'!`);
        this.logger.error(e);
        return {
          message: {
            code: 123456, // TODO MessageCode
          },
        };
      } else {
        this.logger.error('Nastala neočekávaná chyba při zpracování akce.');
        this.logger.error(e);
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Get('state')
  public async getStimulatorState(
    @Headers('Async-Request') asyncRequest: boolean
  ): Promise<ResponseObject<any>> {
    try {
      const state = await this.stimulator.getState(asyncRequest);
      return {
        data: state,
        message: {
          code: MessageCodes.CODE_SUCCESS,
        },
      };
    } catch (e) {
      this.logger.error(
        'Nastala neočekávaná chyba při získávání stavu stimulátoru.'
      );
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }
}
