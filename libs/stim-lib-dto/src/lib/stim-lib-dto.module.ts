import { DynamicModule, Provider } from '@nestjs/common';

import { createDtoProvider } from './provider/dto-provider';
import { StimLibDtoCoreModule } from './stim-lib-dto-core.module';

export class StimLibDtoModule {
  public static forRoot(): DynamicModule {
    return {
      module: StimLibDtoModule,
      imports: [StimLibDtoCoreModule.forRoot()],
    };
  }

  public static forFeature<T extends number>(scope: string): DynamicModule {
    const dtoProvider: Provider = createDtoProvider<T>(scope);

    return {
      module: StimLibDtoModule,
      providers: [dtoProvider],
      exports: [dtoProvider],
    };
  }
}
