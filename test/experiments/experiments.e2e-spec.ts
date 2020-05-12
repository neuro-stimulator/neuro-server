import { HttpServer, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import * as request from 'supertest';

import {
  createEmptyExperiment,
  createEmptyExperimentCVEP,
  createEmptyExperimentERP,
  createEmptyExperimentFVEP,
  createEmptyExperimentREA,
  createEmptyExperimentTVEP,
  createEmptyOutputERP,
  createEmptyOutputFVEP,
  createEmptyOutputTVEP,
  ErpOutput,
  Experiment,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP,
  ExperimentType,
  FvepOutput,
  MessageCodes,
  ResponseObject,
  TvepOutput,
} from '@stechy1/diplomka-share';

import { ExperimentsModule } from '../../src/experiments/experiments.module';
import { ExperimentsService } from '../../src/experiments/experiments.service';
import { SerialService } from '../../src/low-level/serial.service';
import { ExperimentRepository } from '../../src/experiments/repository/experiment.repository';
import { ExperimentErpRepository } from '../../src/experiments/repository/experiment-erp.repository';
import { ExperimentCvepRepository } from '../../src/experiments/repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from '../../src/experiments/repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from '../../src/experiments/repository/experiment-tvep.repository';
import { ExperimentReaRepository } from '../../src/experiments/repository/experiment-rea.repository';
import { ErrorMiddleware } from '../../src/error.middleware';
import { TOTAL_OUTPUT_COUNT } from '../../src/config/config';
import { initDbTriggers } from '../../src/db-setup';
import { clearDatabase, commonAttributes, createInMemoryTypeOrmModule } from '../test-helpers';
import { createSerialServiceMock } from '../../src/low-level/serial.service.jest';

describe('Experiments integration test', () => {
  const BASE_API = '/api/experiments';
  const emptyExperiment: Experiment = createEmptyExperiment();
  let app: INestApplication;
  let httpServer: HttpServer;
  let experimentsService: ExperimentsService;

  beforeAll(() => {
    emptyExperiment.id = -1;
    emptyExperiment.name = 'empty';
    emptyExperiment.description = 'emptyDescription';
    emptyExperiment.type = ExperimentType.NONE;
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        createInMemoryTypeOrmModule(),
        ExperimentsModule
      ],
      providers: [
        ExperimentsService,
        ExperimentRepository,
        ExperimentErpRepository,
        ExperimentCvepRepository,
        ExperimentFvepRepository,
        ExperimentTvepRepository,
        ExperimentReaRepository,
        { provide: SerialService, useFactory: createSerialServiceMock }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new ErrorMiddleware());
    httpServer = app.getHttpServer();
    experimentsService = module.get<ExperimentsService>(ExperimentsService);
    await app.init();
    await initDbTriggers();
  });

  describe('all()', () => {
    it('positive - should return all existing experiments', async () => {
      const experiments: Experiment[] = new Array(1).fill(0).map((value: number, index: number) => {
        const experiment: Experiment = createEmptyExperimentCVEP();
        experiment.id = index;
        experiment.name = `CVEP-${index}`;
        return experiment;
      });
      for (const experiment of experiments) {
        await experimentsService.insert(experiment);
      }

      const expected: ResponseObject<Experiment[]> = { data: experiments.map(experiment => commonAttributes(experiment, emptyExperiment)) };

      return request(httpServer)
      .get(BASE_API)
      .expect(200)
      .expect(expected);
    });
  });

  describe('nameExists()', () => {
    it('positive - should check name existence of a new experiment', async () => {
      const experiment: Experiment = createEmptyExperimentCVEP();
      experiment.name = 'unique';

      const expected: ResponseObject<{ exists: boolean }> = { data: { exists: false } };

      return request(httpServer)
      .get(`${BASE_API}/name-exists/${experiment.name}/new`)
      .expect(200)
      .expect(expected);
    });

    it('negative - should check existing name for a new experiment', async () => {
      const experiment: Experiment = createEmptyExperimentCVEP();
      experiment.name = 'original';
      await experimentsService.insert(experiment);

      const expected: ResponseObject<{ exists: boolean }> = { data: { exists: true } };

      return request(httpServer)
      .get(`${BASE_API}/name-exists/${experiment.name}/new`)
      .expect(200)
      .expect(expected);
    });

    it('positive - should check name existence of existing experiment', async () => {
      let experiment: Experiment = createEmptyExperimentCVEP();
      experiment.name = 'original';
      experiment = await experimentsService.insert(experiment);

      const expected: ResponseObject<{ exists: boolean }> = { data: { exists: false } };

      return request(httpServer)
      .get(`${BASE_API}/name-exists/unique/${experiment.id}`)
      .expect(200)
      .expect(expected);
    });

    it('positive - should check same name existence of existing experiment', async () => {
      let experiment: Experiment = createEmptyExperimentCVEP();
      experiment.name = 'original';
      experiment = await experimentsService.insert(experiment);

      const expected: ResponseObject<{ exists: boolean }> = { data: { exists: false } };

      return request(httpServer)
      .get(`${BASE_API}/name-exists/${experiment.name}/${experiment.id}`)
      .expect(200)
      .expect(expected);
    });

    it('negative - should check name existence of existing experiment', async () => {
      let experiment: Experiment = createEmptyExperimentCVEP();
      const staticExperiment: Experiment = createEmptyExperimentCVEP();
      experiment.name = 'original';
      staticExperiment.name = 'problematic';
      experiment = await experimentsService.insert(experiment);
      await experimentsService.insert(staticExperiment);

      const expected: ResponseObject<{ exists: boolean }> = { data: { exists: true } };

      return request(httpServer)
      .get(`${BASE_API}/name-exists/${staticExperiment.name}/${experiment.id}`)
      .expect(200)
      .expect(expected);
    });
  });

  describe('experimentById()', () => {
    it('positive - should get experiment by id', async () => {
      let experiment: Experiment = createEmptyExperimentCVEP();
      experiment.name = 'cvep';
      experiment = await experimentsService.insert(experiment);

      const expected: ResponseObject<Experiment> = { data: experiment };

      return request(httpServer)
      .get(`${BASE_API}/${experiment.id}`)
      .expect(200)
      .expect(expected);
    });

    it('negative - should return error when experiment not found', async () => {
      const experiment: Experiment = createEmptyExperimentCVEP();
      experiment.id = 1;

      const expected: ResponseObject<Experiment> = {
        message: {
          code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          params: {
            id: experiment.id
          }
        }
      };

      return request(httpServer)
      .get(`${BASE_API}/${experiment.id}`)
      .expect(200)
      .expect(expected);
    });

    it('negative - should return error for invalid experiment id', async () => {
      const expected: ResponseObject<Experiment> = {
        message: {
          code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
          params: {
            id: null
          }
        }
      };

      return request(httpServer)
      .get(`${BASE_API}/invalid`)
      .expect(200)
      .expect(expected);
    });
  });

  describe('insert()', () => {
    describe('ERP experiment', () => {
      it('positive - should insert new experiment', async () => {
        const experiment: ExperimentERP = createEmptyExperimentERP();
        experiment.name = 'erp';
        experiment.outputCount = TOTAL_OUTPUT_COUNT;
        delete experiment.usedOutputs.audioFile;
        delete experiment.usedOutputs.imageFile;

        const expectedExperiment: ExperimentERP = { ...experiment };
        expectedExperiment.id = 1;
        expectedExperiment.outputs = new Array<number>(expectedExperiment.outputCount).fill(0).map((value: number, index: number) => {
          const output: ErpOutput = createEmptyOutputERP(expectedExperiment, index + 1);
          output.id = index + 1;
          output.outputType.audioFile = null;
          output.outputType.imageFile = null;
          return output;
        });

        const expected: ResponseObject<Experiment> = {
          data: expectedExperiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
            params: {
              id: expectedExperiment.id
            }
          }
        };

        return request(httpServer)
        .post(BASE_API)
        .send(experiment)
        .expect(201)
        .expect(expected);
      });
    });

    describe('CVEP experiment', () => {
      it('positive - should insert new experiment', async () => {
        const experiment: ExperimentCVEP = createEmptyExperimentCVEP();
        experiment.name = 'cvep';

        const expectedExperiment: ExperimentCVEP = { ...experiment };
        expectedExperiment.id = 1;
        expectedExperiment.usedOutputs.audioFile = null;
        expectedExperiment.usedOutputs.imageFile = null;

        const expected: ResponseObject<Experiment> = {
          data: expectedExperiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
            params: {
              id: expectedExperiment.id
            }
          }
        };

        return request(httpServer)
        .post(BASE_API)
        .send(experiment)
        .expect(201)
        .expect(expected);
      });
    });

    describe('FVEP experiment', () => {
      it('positive - should insert new experiment', async () => {
        const experiment: ExperimentFVEP = createEmptyExperimentFVEP();
        experiment.name = 'fvep';
        experiment.outputCount = TOTAL_OUTPUT_COUNT;
        delete experiment.usedOutputs.audioFile;
        delete experiment.usedOutputs.imageFile;

        const expectedExperiment: ExperimentFVEP = { ...experiment };
        expectedExperiment.id = 1;
        expectedExperiment.outputs = new Array<number>(expectedExperiment.outputCount).fill(0).map((value: number, index: number) => {
          const output: FvepOutput = createEmptyOutputFVEP(expectedExperiment, index);
          output.id = index + 1;
          output.outputType.audioFile = null;
          output.outputType.imageFile = null;
          return output;
        });

        const expected: ResponseObject<Experiment> = {
          data: expectedExperiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
            params: {
              id: expectedExperiment.id
            }
          }
        };

        return request(httpServer)
        .post(BASE_API)
        .send(experiment)
        .expect(201)
        .expect(expected);
      });
    });

    describe('TVEP experiment', () => {
      it('positive - should insert new experiment', async () => {
        const experiment: ExperimentTVEP = createEmptyExperimentTVEP();
        experiment.name = 'tvep';
        experiment.outputCount = TOTAL_OUTPUT_COUNT;
        delete experiment.usedOutputs.audioFile;
        delete experiment.usedOutputs.imageFile;

        const expectedExperiment: ExperimentTVEP = { ...experiment };
        expectedExperiment.id = 1;
        expectedExperiment.outputs = new Array<number>(expectedExperiment.outputCount).fill(0).map((value: number, index: number) => {
          const output: TvepOutput = createEmptyOutputTVEP(expectedExperiment, index);
          output.id = index + 1;
          output.outputType.audioFile = null;
          output.outputType.imageFile = null;
          return output;
        });

        const expected: ResponseObject<Experiment> = {
          data: expectedExperiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
            params: {
              id: expectedExperiment.id
            }
          }
        };

        return request(httpServer)
        .post(BASE_API)
        .send(experiment)
        .expect(201)
        .expect(expected);
      });
    });

    describe('REA experiment', () => {
      it('positive - should insert new experiment', async () => {
        const experiment: ExperimentREA = createEmptyExperimentREA();
        experiment.name = 'rea';

        const expectedExperiment: ExperimentREA = { ...experiment };
        expectedExperiment.id = 1;
        expectedExperiment.usedOutputs.audioFile = null;
        expectedExperiment.usedOutputs.imageFile = null;

        const expected: ResponseObject<Experiment> = {
          data: expectedExperiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
            params: {
              id: expectedExperiment.id
            }
          }
        };

        return request(httpServer)
        .post(BASE_API)
        .send(experiment)
        .expect(201)
        .expect(expected);
      });
    });
  });

  describe('update()', () => {
    describe('ERP experiment', () => {
      it('positive - should update existing ERP experiment', async () => {
        let experiment: ExperimentERP = createEmptyExperimentERP();
        experiment.name = 'erp';
        experiment.outputCount = TOTAL_OUTPUT_COUNT;
        experiment = await experimentsService.insert(experiment) as ExperimentERP;

        experiment.name = 'changed';

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });

      it('negative - should not update experiment which does not exists', async () => {
        const experiment: Experiment = createEmptyExperimentERP();
        experiment.id = 1;
        experiment.name = 'erp';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });
    });

    describe('CVEP experiment', () => {
      it('positive - should update existing CVEP experiment', async () => {
        let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
        experiment.name = 'cvep';
        experiment = await experimentsService.insert(experiment) as ExperimentCVEP;

        experiment.name = 'changed';

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });

      it('negative - should not update experiment which does not exists', async () => {
        const experiment: Experiment = createEmptyExperimentCVEP();
        experiment.id = 1;
        experiment.name = 'cvep';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });
    });

    describe('FVEP experiment', () => {
      it('positive - should update existing CVEP experiment', async () => {
        let experiment: ExperimentFVEP = createEmptyExperimentFVEP();
        experiment.name = 'fvep';
        experiment.outputCount = TOTAL_OUTPUT_COUNT;
        experiment = await experimentsService.insert(experiment) as ExperimentFVEP;

        experiment.name = 'changed';

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });

      it('negative - should not update experiment which does not exists', async () => {
        const experiment: ExperimentFVEP = createEmptyExperimentFVEP();
        experiment.id = 1;
        experiment.name = 'fvep';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });
    });

    describe('TVEP experiment', () => {
      it('positive - should update existing CVEP experiment', async () => {
        let experiment: ExperimentTVEP = createEmptyExperimentTVEP();
        experiment.name = 'tvep';
        experiment.outputCount = TOTAL_OUTPUT_COUNT;
        experiment = await experimentsService.insert(experiment) as ExperimentTVEP;

        experiment.name = 'changed';

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });

      it('negative - should not update experiment which does not exists', async () => {
        const experiment: ExperimentTVEP = createEmptyExperimentTVEP();
        experiment.id = 1;
        experiment.name = 'tvep';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });
    });

    describe('REA experiment', () => {
      it('positive - should update existing REA experiment', async () => {
        let experiment: ExperimentREA = createEmptyExperimentREA();
        experiment.name = 'rea';
        experiment = await experimentsService.insert(experiment) as ExperimentREA;

        experiment.name = 'changed';

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });

      it('negative - should not update experiment which does not exists', async () => {
        const experiment: ExperimentREA = createEmptyExperimentREA();
        experiment.id = 1;
        experiment.name = 'rea';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: {
              id: experiment.id
            }
          }
        };

        return request(httpServer)
        .patch(BASE_API)
        .send(experiment)
        .expect(200)
        .expect(expected);
      });
    });
  });

  describe('delete()', () => {
    describe('ERP experiment', () => {
      it('positive - should delete experiment', async () => {
        let experiment: ExperimentERP = createEmptyExperimentERP();
        experiment.name = 'erp';
        experiment = await experimentsService.insert(experiment) as ExperimentERP;

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });

      it('negative - should ', async () => {
        const experiment: ExperimentERP = createEmptyExperimentERP();
        experiment.id = 1;
        experiment.name = 'erp';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });
    });

    describe('CVEP experiment', () => {
      it('positive - should delete experiment', async () => {
        let experiment: ExperimentCVEP = createEmptyExperimentCVEP();
        experiment.name = 'cvep';
        experiment = await experimentsService.insert(experiment) as ExperimentCVEP;

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });

      it('negative - should ', async () => {
        const experiment: ExperimentCVEP = createEmptyExperimentCVEP();
        experiment.id = 1;
        experiment.name = 'cvep';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });
    });

    describe('FVEP experiment', () => {
      it('positive - should delete experiment', async () => {
        let experiment: ExperimentFVEP = createEmptyExperimentFVEP();
        experiment.name = 'fvep';
        experiment = await experimentsService.insert(experiment) as ExperimentFVEP;

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });

      it('negative - should ', async () => {
        const experiment: ExperimentFVEP = createEmptyExperimentFVEP();
        experiment.id = 1;
        experiment.name = 'fvep';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });
    });

    describe('TVEP experiment', () => {
      it('positive - should delete experiment', async () => {
        let experiment: ExperimentTVEP = createEmptyExperimentTVEP();
        experiment.name = 'tvep';
        experiment = await experimentsService.insert(experiment) as ExperimentTVEP;

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });

      it('negative - should ', async () => {
        const experiment: ExperimentTVEP = createEmptyExperimentTVEP();
        experiment.id = 1;
        experiment.name = 'tvep';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });
    });

    describe('REA experiment', () => {
      it('positive - should delete experiment', async () => {
        let experiment: ExperimentREA = createEmptyExperimentREA();
        experiment.name = 'rea';
        experiment = await experimentsService.insert(experiment) as ExperimentREA;

        const expected: ResponseObject<Experiment> = {
          data: experiment,
          message: {
            code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });

      it('negative - should ', async () => {
        const experiment: ExperimentREA = createEmptyExperimentREA();
        experiment.id = 1;
        experiment.name = 'rea';

        const expected: ResponseObject<Experiment> = {
          message: {
            code: MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND,
            params: { id: experiment.id }
          }
        };

        return request(httpServer)
        .delete(`${BASE_API}/${experiment.id}`)
        .expect(200)
        .expect(expected);
      });
    });
  });

  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
