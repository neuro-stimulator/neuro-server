import { DynamicModule } from '@nestjs/common';

export class StimLibDtoCoreModule {

  public static forRoot(): DynamicModule {
    return {
      module: StimLibDtoCoreModule,

    };
  }

}
