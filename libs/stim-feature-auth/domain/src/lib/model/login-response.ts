import { User } from '@stechy1/diplomka-share';

export interface LoginResponse {
  accessToken: string;
  expiresIn: Date;
  refreshToken?: string;
  user?: User;
}
