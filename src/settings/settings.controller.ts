import { Body, Controller, Get, Logger, Options, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './settings';
import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';
import { ControllerException } from '../controller-exception';

@Controller('/api/settings')
export class SettingsController {

  private readonly logger: Logger = new Logger(SettingsController.name);

  constructor(private readonly _service: SettingsService) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get()
  public async sendSettings(): Promise<ResponseObject<Settings>> {
    return { data: this._service.settings };
  }

  @Post()
  public async updateSettings(@Body() settings: Settings) {
    try {
      await this._service.updateSettings(settings);
      return {
        message: {
          code: MessageCodes.CODE_SETTINGS_UPDATED
        }
      };
    } catch (e) {
      this.logger.error(e.message);
      throw new ControllerException(MessageCodes.CODE_SETTINGS_NOT_UPDATED);
    }
  }

}
