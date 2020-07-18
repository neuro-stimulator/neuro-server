export interface JwtPayload {
  sub: number;
  iat?: number;
  exp?: number;
  jti?: string;
}
