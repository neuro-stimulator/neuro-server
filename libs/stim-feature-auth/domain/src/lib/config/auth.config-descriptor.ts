import { BaseAsyncOptions, BaseModuleOptions } from '@diplomka-backend/stim-lib-config';

export interface AuthModuleConfig extends BaseModuleOptions {
  jwt: JwtAuthModuleConfig;
}

export interface JwtAuthModuleConfig {
  secretKey: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  refreshTokenLength: number;
}

export interface AuthModuleAsyncConfig extends BaseAsyncOptions<AuthModuleConfig> {}
