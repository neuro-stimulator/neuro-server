import { Body, Controller, Get, Options, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './settings';
import { ResponseObject } from '@stechy1/diplomka-share';

@Controller('/api/settings')
export class SettingsController {

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
    await this._service.updateSettings(settings);
  }

}
