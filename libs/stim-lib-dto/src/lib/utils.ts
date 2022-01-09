import { DTO_INJECTION_TOKEN } from './constants';

export function getDtoInjectionToken(scope: string): string {
  return `${scope}${DTO_INJECTION_TOKEN}`
}
