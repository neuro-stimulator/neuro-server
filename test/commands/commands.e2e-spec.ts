import { HttpServer, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import * as request from 'supertest';

import { createEmptyExperimentCVEP, ExperimentCVEP } from '@stechy1/diplomka-share';

import { CommandsService } from '../../src/commands/commands.service';
import { CommandsModule } from '../../src/commands/commands.module';
import { ErrorMiddleware } from '../../src/error.middleware';
import { ExperimentsModule } from '../../src/experiments/experiments.module';
import { ExperimentResultsModule } from '../../src/experiment-results/experiment-results.module';
import { LowLevelModule } from '../../src/low-level/low-level.module';
import { SequencesModule } from '../../src/sequences/sequences.module';
import { IpcModule } from '../../src/ipc/ipc.module';
import { IpcService } from '../../src/ipc/ipc.service';
import { createIpcServiceMock } from '../../src/ipc/ipc.service.jest';
import { SerialService } from '../../src/low-level/serial.service';
import { FakeSerialService } from '../../src/low-level/fake-serial/fake-serial.service';
import { TOTAL_OUTPUT_COUNT } from '../../src/config/config';
import { ExperimentsService } from '../../src/experiments/experiments.service';
import { ExperimentResultsService } from '../../src/experiment-results/experiment-results.service';
import { clearDatabase, createInMemoryTypeOrmModule } from '../test-helpers';

describe('Commands integration test', () => {
  const BASE_API = '/api/commands';

  let app: INestApplication;
  let httpServer: HttpServer;
  let commandsService: CommandsService;
  let experimentsService: ExperimentsService;
  let experimentResultsService: ExperimentResultsService;
  let fakeSerialService: SerialService;

  beforeAll(() => {
    process.env.VIRTUAL_SERIAL_SERVICE = 'true';
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        createInMemoryTypeOrmModule(),
        CommandsModule,
        ExperimentsModule,
        ExperimentResultsModule,
        SequencesModule,
        LowLevelModule,
        IpcModule
      ],
      providers: [
        CommandsService,
      ]
    })
                             .overrideProvider(IpcService)
                             .useFactory({ factory: createIpcServiceMock })
                             .compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new ErrorMiddleware());
    httpServer = app.getHttpServer();
    commandsService = module.get<CommandsService>(CommandsService);
    experimentsService = module.get<ExperimentsService>(ExperimentsService);
    experimentResultsService = module.get<ExperimentResultsService>(ExperimentResultsService);
    fakeSerialService = module.get<SerialService>(SerialService);

    await app.init();
    await fakeSerialService.open(FakeSerialService.VIRTUAL_PORT_NAME);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('stimulatorState()', () => {
    const state = 0;
    const noUpdate = 1;

    it('positive - should get stimulator state', async () => {
      return request(httpServer)
      .get(`${BASE_API}/stimulator-state`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.state).toBe(state);
        expect(res.body.data.noUpdate).toBe(Boolean(noUpdate));
        expect(res.body.data.timestamp).toBeDefined();
      });
    });
  });

  describe('uploadExperiment()', () => {
    it('positive - should be able to upload experiment to stimulator', async () => {
      let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment = await experimentsService.insert(experiment) as ExperimentCVEP;

      await request(httpServer)
      .patch(`${BASE_API}/experiment/upload/${experiment.id}`)
      .expect(200);

      expect(experimentResultsService.activeExperimentResult).toBeDefined();
      expect(await commandsService.stimulatorState(true)).toEqual(expect.objectContaining({ state: 1 }));
    });
  });

  describe('setupExperiment()', () => {
    it('positive - should initialize uploaded experiment in stimulator', async () => {
      let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment = await experimentsService.insert(experiment) as ExperimentCVEP;
      await commandsService.uploadExperiment(experiment.id);

      await request(httpServer)
      .patch(`${BASE_API}/experiment/setup/${experiment.id}`)
      .expect(200);

      expect(await commandsService.stimulatorState(true)).toEqual(expect.objectContaining({ state: 2 }));
    });
  });

  describe('runExperiment()', () => {
    it('positive - should start the experiment in stimulator', async () => {
      let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment = await experimentsService.insert(experiment) as ExperimentCVEP;
      await commandsService.uploadExperiment(experiment.id);
      await commandsService.setupExperiment(experiment.id);

      await request(httpServer)
      .patch(`${BASE_API}/experiment/run/${experiment.id}`)
      .expect(200);

      expect(await commandsService.stimulatorState(true)).toEqual(expect.objectContaining({ state: 3 }));
    });
  });

  describe('pauseExperiment()', () => {
    it('positive - should pause running experiment in stimulator', async () => {
      let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment = await experimentsService.insert(experiment) as ExperimentCVEP;
      await commandsService.uploadExperiment(experiment.id);
      await commandsService.setupExperiment(experiment.id);
      await commandsService.runExperiment(experiment.id);

      await request(httpServer)
      .patch(`${BASE_API}/experiment/pause/${experiment.id}`)
      .expect(200);

      expect(await commandsService.stimulatorState(true)).toEqual(expect.objectContaining({ state: 4 }));
    });
  });

  describe('finishExperiment()', () => {
    it('positive - should finish running experiment in stimulator', async () => {
      let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment = await experimentsService.insert(experiment) as ExperimentCVEP;
      await commandsService.uploadExperiment(experiment.id);
      await commandsService.setupExperiment(experiment.id);
      await commandsService.runExperiment(experiment.id);

      await request(httpServer)
      .patch(`${BASE_API}/experiment/finish/${experiment.id}`)
      .expect(200);

      expect(await commandsService.stimulatorState(true)).toEqual(expect.objectContaining({ state: 5 }));
      await new Promise((r) => setTimeout(r, 500));
      expect(experimentResultsService.activeExperimentResult).toBeNull();
    });
  });

  describe('clearExperiment()', () => {
    it('positive - should clear experiment in stimulator', async () => {
      let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment = await experimentsService.insert(experiment) as ExperimentCVEP;
      await commandsService.uploadExperiment(experiment.id);

      await request(httpServer)
      .patch(`${BASE_API}/experiment/clear`)
      .expect(200);

      expect(await commandsService.stimulatorState(true)).toEqual(expect.objectContaining({ state: 6 }));
    });
  });

  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
