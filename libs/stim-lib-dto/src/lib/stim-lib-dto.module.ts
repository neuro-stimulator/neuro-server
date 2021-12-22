import { DynamicModule, Provider } from '@nestjs/common';

import { StimLibDtoCoreModule } from './stim-lib-dto-core.module';
import { getDtoInjectionToken } from './utils';
import { DtoService } from './services/dto.service';

export class StimLibDtoModule {

  public static forRoot(): DynamicModule {
    return {
      module: StimLibDtoModule,
      imports: [StimLibDtoCoreModule.forRoot()]
    }
  }

  public static forFeature<T extends number>(scope: string): DynamicModule {
    const dtoProvider: Provider = {
      provide: getDtoInjectionToken(scope),
      useValue: new DtoService<T>()
    }

    return {
      module: StimLibDtoModule,
      providers: [ dtoProvider ],
      exports: [ dtoProvider ]
    }
  }

}
