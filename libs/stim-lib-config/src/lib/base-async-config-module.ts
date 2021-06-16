import { DynamicModule, Provider } from '@nestjs/common';

import { BaseAsyncOptions, BaseModuleOptionsFactory } from './interfaces';

export class BaseAsyncConfigModule {
  public static forRootAsync<O extends BaseAsyncOptions<T>, T>(moduleOptions: O): DynamicModule {
    const providers = this.createConnectProviders(moduleOptions);
    return {
      module: BaseAsyncConfigModule,
      imports: moduleOptions.imports,
      providers,
      exports: providers
    };
  }

  private static createConnectProviders<O extends BaseAsyncOptions<T>, T>(moduleOptions: O): Provider[] {
    if (moduleOptions.useExisting || moduleOptions.useFactory) {
      return [this.createConnectOptionsProvider(moduleOptions)];
    }

    return [
      this.createConnectOptionsProvider(moduleOptions),
      {
        provide: moduleOptions.useClass,
        useClass: moduleOptions.useClass
      }
    ];
  }

  private static createConnectOptionsProvider<O extends BaseAsyncOptions<T>, T>(moduleOptions: O): Provider {
    if (moduleOptions.useFactory) {

      return {
        provide: moduleOptions.name,
        useFactory: async (options) => {
          const factory = await moduleOptions.useFactory(options);
          return factory.createOptions();
        },
        inject: moduleOptions.inject || []
      };
    }

    return {
      provide: moduleOptions.name,
      useFactory: async (optionsFactory: BaseModuleOptionsFactory<T>) => optionsFactory.createOptions(),
      inject: [moduleOptions.useExisting || moduleOptions.useClass]
    };
  }
}
