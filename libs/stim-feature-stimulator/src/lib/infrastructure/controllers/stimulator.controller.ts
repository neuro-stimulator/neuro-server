import { Body, Controller, Logger, Patch } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { FileAccessRestrictedException } from '@diplomka-backend/stim-feature-file-browser';

import { FirmwareUpdateFailedException } from '../../domain/exception';
import { StimulatorFacade } from '../service/stimulator.facade';

@Controller('/api/stimulator')
export class StimulatorController {
  private readonly logger: Logger = new Logger(StimulatorController.name);

  constructor(private readonly stimulator: StimulatorFacade) {}

  @Patch(':update-firmware')
  public async updateFirmware(
    @Body() body: { path: string }
  ): Promise<ResponseObject<void>> {
    try {
      await this.stimulator.updateFirmware(body.path);
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS_LOW_LEVEL_FIRMWARE_UPDATED,
        },
      };
    } catch (e) {
      this.logger.error(e);
      if (e instanceof FileAccessRestrictedException) {
        this.logger.error('Firmware byl umístěn na nevalidním místě');
      } else if (e instanceof FirmwareUpdateFailedException) {
        this.logger.error('Firmware se nepodařilo aktualizovat');
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR_LOW_LEVEL_FIRMWARE_NOT_UPDATED,
        },
      };
      // TODO error handling
    }
  }
}
