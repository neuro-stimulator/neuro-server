import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@diplomka-backend/stim-lib-config';

import { AuthModuleConfig } from './auth.config-descriptor';
import {
  AUTH_CONFIG_PREFIX,
  KEY__JWT__SECRET_KEY,
  KEY__JWT__ACCESS_TOKEN_TTL,
  KEY__JWT__REFRESH_TOKEN_TTL,
  KEY__JWT__REFRESH_TOKEN_LENGTH,
  KEY__JWT__TIMEZONE
} from './auth.config-constants';

export interface AuthConfigFactory extends BaseModuleOptionsFactory<AuthModuleConfig> {}

export class AuthModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<AuthModuleConfig> implements AuthConfigFactory {

  constructor(config: ConfigService) {
    super(config, AUTH_CONFIG_PREFIX);
  }

  createOptions(): Promise<AuthModuleConfig> | AuthModuleConfig {
    return {
      jwt: {
        secretKey: this.readConfig(KEY__JWT__SECRET_KEY),
        accessTokenTTL: this.readConfig(KEY__JWT__ACCESS_TOKEN_TTL),
        refreshTokenTTL: this.readConfig(KEY__JWT__REFRESH_TOKEN_TTL),
        refreshTokenLength: this.readConfig(KEY__JWT__REFRESH_TOKEN_LENGTH),
        timezone: this.readConfig(KEY__JWT__TIMEZONE)
      }
    };
  }

}
