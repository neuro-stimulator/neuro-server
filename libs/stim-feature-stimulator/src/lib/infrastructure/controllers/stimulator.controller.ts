import { Body, Controller, Logger, Options, Patch } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import {
  FileAccessRestrictedException,
  FileNotFoundException,
} from '@diplomka-backend/stim-feature-file-browser';

import { FirmwareUpdateFailedException } from '../../domain/exception';
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
}
