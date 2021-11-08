import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { DatabaseModuleAsyncConfig, DatabaseModuleConfig, DATABASE_MODULE_CONFIG_CONSTANT, DatabaseModuleConfigFactoryImpl } from './config';
import { DatabaseConfigurator } from './database-configurator';

export class StimLibDatabaseModule {

  public static forRoot(): DynamicModule {

    const configProvider = BaseAsyncConfigModule.forRootAsync<DatabaseModuleAsyncConfig, DatabaseModuleConfig>({
      name: DATABASE_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new DatabaseModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    return {
      module: StimLibDatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigurator,
          imports: [
            configProvider
          ]
        }),
      ]
    }
  }

}
