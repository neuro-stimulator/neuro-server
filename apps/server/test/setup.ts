import * as fs from 'fs';
import * as path from 'path';
import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { User } from '@stechy1/diplomka-share';

import { ApplicationReadyEvent } from '@diplomka-backend/stim-lib-common';
import { SeedCommand, TruncateCommand } from '@diplomka-backend/stim-feature-seed/application';
import { DataContainer, EntityStatistic } from '@diplomka-backend/stim-feature-seed/domain';
import { AuthGuard } from '@diplomka-backend/stim-feature-auth/application';

import { AppModule } from '../src/app/app.module';
import { ErrorMiddleware } from '../src/app/error.middleware';
import { initDbTriggers } from '../src/app/db-setup';

export interface SetupConfiguration {
  dataContainersRoot?: string;
  useFakeAuthentication?: boolean;
  user?: Partial<User>;
}

const DEFAULT_CONFIG: SetupConfiguration = {
  useFakeAuthentication: false,
};

class FakeAuthGuard implements CanActivate {
  constructor(private readonly user: Partial<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: Request = ctx.getRequest<Request>();

    req['user'] = this.user;

    return true;
  }
}

export async function setup(config: SetupConfiguration = {}): Promise<[INestApplication, supertest.SuperAgentTest, Record<string, DataContainer[]>]> {
  Object.assign({}, DEFAULT_CONFIG, config);

  let builder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (config.useFakeAuthentication) {
    builder = builder.overrideProvider(AuthGuard).useValue(new FakeAuthGuard(config.user));
  }

  const module: TestingModule = await builder.compile();

  const app = module.createNestApplication();
  app.use(cookieParser('secret'));
  app.useGlobalFilters(new ErrorMiddleware());
  await app.init();
  await initDbTriggers();

  if (config.useFakeAuthentication) {
    app.useGlobalGuards();
  }

  const eventBus = app.get(EventBus);
  eventBus.publish(new ApplicationReadyEvent());

  let dataContainers: Record<string, DataContainer[]>;
  if (config.dataContainersRoot !== undefined) {
    const dataContainersPath = path.join(__dirname, 'resources', config.dataContainersRoot);
    dataContainers = await readDataContainers(dataContainersPath);
    const statistics: Record<string, EntityStatistic> = await app.get(CommandBus).execute(new SeedCommand(dataContainers));
    for (const entityStatistic of Object.values(statistics)) {
      if (entityStatistic.failed.inserted.count != 0) {
        await app.get(CommandBus).execute(new TruncateCommand());
        throw Error('Seed database was not successfull!');
      }
    }
  }

  const agent = supertest.agent(app.getHttpServer());
  agent.use((req) => req.set({ 'x-client-id': 'e2e-test-client' }));

  return [app, agent, dataContainers];
}

/**
 * Pomocná funkce pro načtení data containerů pro testovací účely
 *
 * @param root Kořenová složka s data containery
 */
async function readDataContainers(root: string): Promise<Record<string, DataContainer[]>> {
  const dataContainerFiles: string[] = fs.readdirSync(root).filter((file) => file.endsWith('.json'));
  const dataContainers: Record<string, DataContainer[]> = {};

  for (const dataContainerPath of dataContainerFiles) {
    const content = fs.readFileSync(path.join(root, dataContainerPath), { encoding: 'UTF-8' });
    const dataContainer = JSON.parse(content) as DataContainer;

    if (!dataContainers[dataContainer.entityName]) {
      dataContainers[dataContainer.entityName] = [];
    }
    dataContainers[dataContainer.entityName].push(dataContainer);
  }

  return dataContainers;
}

export async function tearDown(app: INestApplication): Promise<void> {
  await app.get(CommandBus).execute(new TruncateCommand());
  await app.close();
}
