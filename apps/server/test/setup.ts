import * as fs from 'fs';
import * as path from 'path';
import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { CanActivate, ConsoleLogger, ExecutionContext, INestApplication } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { User } from '@stechy1/diplomka-share';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';
import { SeedCommand, TruncateCommand } from '@neuro-server/stim-feature-seed/application';
import { DataContainer, DataContainers, EntityStatistic } from '@neuro-server/stim-feature-seed/domain';
import { AuthGuard } from '@neuro-server/stim-feature-auth/application';

import { AppModule } from '../src/app/app.module';
import { ErrorMiddleware } from '../src/app/error.middleware';
import { waitFor } from './helpers';
import { DataContainersRoot, SetupConfiguration } from './setup-configuration';

const DEFAULT_CONFIG: SetupConfiguration = {
  useFakeAuthorization: false,
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

export async function setupFromConfigFile(...configPath: string[]): Promise<[INestApplication, supertest.SuperAgentTest, DataContainers]> {
  const config: SetupConfiguration = JSON.parse(fs.readFileSync(path.join(...configPath), { encoding: 'UTF-8' }));
  return setup(config);
}

/**
 * Inicializuje aplikaci pro E2E testování
 *
 * @param config {@link SetupConfiguration}
 * @return [{@link INestApplication}, {@link supertest.SuperAgentTest}, {@link DataContainers}]
 */
export async function setup(config: SetupConfiguration): Promise<[INestApplication, supertest.SuperAgentTest, DataContainers]> {
  Object.assign({}, DEFAULT_CONFIG, config);

  let builder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (config.useFakeAuthorization) {
    builder = builder.overrideProvider(AuthGuard).useValue(new FakeAuthGuard(config.user));
  }

  builder.setLogger(new ConsoleLogger());
  const module: TestingModule = await builder.compile();

  const app = module.createNestApplication();
  app.use(cookieParser('secret'));
  app.useGlobalFilters(new ErrorMiddleware());
  await app.init();

  const commandBus = app.get(CommandBus);

  if (config.useFakeAuthorization) {
    app.useGlobalGuards();
  }

  let dataContainers: DataContainers;
  if (config.dataContainersRoot !== undefined) {
    dataContainers = await readDataContainers(config.dataContainersRoot);
    const statistics: Record<string, EntityStatistic> = await app.get(CommandBus).execute(new SeedCommand(dataContainers));
    for (const entityStatistic of Object.values(statistics)) {
      if (entityStatistic.failed.inserted.count != 0) {
        await commandBus.execute(new TruncateCommand());
        throw Error('Seed database was not successfull!');
      }
    }
  }

  const agent: supertest.SuperAgentTest = supertest.agent(app.getHttpServer());
  agent.use((req) => req.set({ 'x-client-id': 'e2e-test-client' }));

  const eventBus = app.get(EventBus);
  await eventBus.publish(new ApplicationReadyEvent());

  await waitFor(1000);

  return [app, agent, dataContainers];
}

export async function readDataContainers(dataContainersRoot: DataContainersRoot): Promise<DataContainers> {
  const resourcesDirectory = path.join(__dirname, 'resources');
  return _readDataContainers(resourcesDirectory, dataContainersRoot);
}

/**
 * Pomocná funkce pro načtení data containerů pro testovací účely
 *
 * @param resourcesDir Cesta ke složce resources, odkud se budou počítat veškeré datakontejnery
 * @param dataContainersRoot Konfigurace datakontejnerů
 */
async function _readDataContainers(resourcesDir: string, dataContainersRoot: DataContainersRoot): Promise<DataContainers> {
  const dataContainers: DataContainers = {};
  const dataContainerFiles: string[] = [];
  const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };
  const jsonFilter = (entry: string) => entry.endsWith('.json');
  const readDirectoryMapper = (entry: string) => fs.readdirSync(path.join(resourcesDir, entry)).filter(jsonFilter);
  const arrayReducer = (prev: [], curr: []) => [...prev, ...curr];
  const processDataContainersArray = (containersRoot: string[]) => {
    return containersRoot
      .map((entry) => {
        const stats = fs.lstatSync(path.join(resourcesDir, entry));
        if (stats.isDirectory()) {
          return readDirectoryMapper(entry).map((file: string) => path.join(entry, file));
        } else if (stats.isFile()) {
          return [entry];
        } else {
          return [];
        }
      })
      .reduce(arrayReducer, []);
  };

  if (typeof dataContainersRoot === 'string') {
    const stats = fs.lstatSync(path.join(resourcesDir, dataContainersRoot));
    if (stats.isDirectory()) {
      dataContainerFiles.push(...readDirectoryMapper(dataContainersRoot).map((file) => path.join(dataContainersRoot, file)));
    } else if (stats.isFile()) {
      dataContainerFiles.push(dataContainersRoot);
    }
  } else if (Array.isArray(dataContainersRoot)) {
    dataContainerFiles.push(...processDataContainersArray(dataContainersRoot));
  } else if (isObject(dataContainersRoot)) {
    for (const [_, paths] of Object.entries(dataContainersRoot)) {
      if (typeof paths === 'string') {
        const stats = fs.lstatSync(path.join(resourcesDir, paths));
        if (stats.isDirectory()) {
          dataContainerFiles.push(...readDirectoryMapper(paths).map((file) => path.join(paths, file)));
        } else if (stats.isFile()) {
          dataContainerFiles.push(paths);
        }
      } else if (Array.isArray(paths)) {
        dataContainerFiles.push(...processDataContainersArray(paths));
      }
    }
  }

  for (const dataContainerPath of dataContainerFiles) {
    const content = fs.readFileSync(path.join(resourcesDir, dataContainerPath), { encoding: 'UTF-8' });
    const dataContainer = JSON.parse(unescape(content)) as DataContainer;

    if (!dataContainers[dataContainer.entityName]) {
      dataContainers[dataContainer.entityName] = [];
    }
    dataContainers[dataContainer.entityName].push(dataContainer);
  }

  return dataContainers;
}

/**
 * Ukončí aplikaci pro E2E testování, vymaže obsah databáze
 *
 * @param app {@link INestApplication}
 */
export async function tearDown(app: INestApplication): Promise<void> {
  await app.get(CommandBus).execute(new TruncateCommand());
  await app.close();
}
