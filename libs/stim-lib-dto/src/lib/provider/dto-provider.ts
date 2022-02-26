import { Provider } from '@nestjs/common';

import { DtoService } from '../services/dto.service';
import { getDtoInjectionToken } from '../utils';

export function createDtoProvider<T extends number>(scope: string, factory: () => DtoService<T> = () => new DtoService<T>()): Provider {
  return {
    provide: getDtoInjectionToken(scope),
    useFactory: factory,
  };
}
