import { Provider } from '@nestjs/common';

import { getDtoInjectionToken } from '../utils';
import { DtoService } from '../services/dto.service';

export function createDtoProvider<T extends number>(scope: string, factory: () => DtoService<T> = () => new DtoService<T>()): Provider {
  return {
    provide: getDtoInjectionToken(scope),
    useFactory: factory,
  };
}
