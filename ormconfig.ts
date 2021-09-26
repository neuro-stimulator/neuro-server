import * as dotenv from "dotenv";
dotenv.config({ path: './apps/server/.env.local' });
import { ConfigService } from "@nestjs/config";

import { DatabaseConfigurator } from './libs/stim-lib-database/src/lib/database-configurator';
import { DatabaseModuleConfigFactoryImpl } from './libs/stim-lib-database/src/lib/config/database.config-factory';
import { DatabaseModuleConfig } from './libs/stim-lib-database/src/lib/config/database.config-descriptor';

const factory = new DatabaseModuleConfigFactoryImpl(new ConfigService());
const config: DatabaseModuleConfig = factory.createOptions() as DatabaseModuleConfig;

const configurator = new DatabaseConfigurator(config);
const typeOrmOptions = configurator.createTypeOrmOptions();

export = typeOrmOptions;
