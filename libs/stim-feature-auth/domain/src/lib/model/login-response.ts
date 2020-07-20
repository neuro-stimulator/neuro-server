import { User } from '@stechy1/diplomka-share';

export interface LoginResponse {
  accessToken: string;
  expiresIn: number | string;
  refreshToken?: string;
  user?: User;
}
