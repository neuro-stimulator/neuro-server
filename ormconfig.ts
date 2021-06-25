import * as dotenv from "dotenv";
dotenv.config({ path: './apps/server/.env.local' });

import { DatabaseConfigurator } from './apps/server/src/app/database-configurator';

const configurator = new DatabaseConfigurator();
const typeOrmOptions = configurator.createTypeOrmOptions();

export = typeOrmOptions;
