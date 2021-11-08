import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface AuthModuleConfig extends BaseModuleOptions {
  jwt: JwtAuthModuleConfig;
}

export interface JwtAuthModuleConfig {
  secretKey: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  refreshTokenLength: number;
  timezone: string;
}

export interface AuthModuleAsyncConfig extends BaseAsyncOptions<AuthModuleConfig> {}
