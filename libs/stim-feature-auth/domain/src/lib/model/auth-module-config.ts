export interface AuthModuleConfig {
  jwtToken: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  refreshTokenLength: number;
}
