import { Inject } from '@nestjs/common';

import { getDtoInjectionToken } from '../utils';

export const InjectDtoService = (scope: string): ReturnType<typeof Inject> => Inject(getDtoInjectionToken(scope));
