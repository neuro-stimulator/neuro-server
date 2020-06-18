import { Body, Controller, Get, Logger, Options, Post } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { Settings } from '../../domain/model/settings';
import { UpdateSettingsFailedException } from '../../domain/exception';
import { SettingsFacade } from '../service/settings.facade';

@Controller('/api/settings')
export class SettingsController {
  private readonly logger: Logger = new Logger(SettingsController.name);

  constructor(private readonly facade: SettingsFacade) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get()
  public async getSettings(): Promise<ResponseObject<Settings>> {
    try {
      const settings: Settings = await this.facade.getSettings();
      return {
        data: settings,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Post()
  public async updateSettings(
    @Body() settings: Settings
  ): Promise<ResponseObject<void>> {
    try {
      await this.facade.updateSettings(settings);
      return {
        message: {
          code: MessageCodes.CODE_SUCCESS_SETTINGS_UPDATED,
        },
      };
    } catch (e) {
      this.logger.error(e.message);
      if (e instanceof UpdateSettingsFailedException) {
        return {
          message: {
            code: MessageCodes.CODE_ERROR_SETTINGS_NOT_UPDATED,
          },
        };
      }
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }
}
