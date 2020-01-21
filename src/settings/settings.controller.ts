import { Body, Controller, Get, HttpException, HttpStatus, Logger, Options, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './settings';
import { ResponseMessageType, ResponseObject } from '@stechy1/diplomka-share';

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
          text: 'Nastavení bylo úspěšně aktualizováno.',
          type: ResponseMessageType.SUCCESS,
        }
      };
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException({
        message: {
          text: 'Nastavení se nepodařilo uložit!',
          type: ResponseMessageType.ERROR,
        }
      }, HttpStatus.OK);
    }
  }

}
