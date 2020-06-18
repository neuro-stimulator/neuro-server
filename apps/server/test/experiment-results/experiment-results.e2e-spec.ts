// import { HttpServer, INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
//
// import {
//   createEmptyExperiment,
//   createEmptyExperimentCVEP,
//   createEmptyExperimentResult,
//   Experiment,
//   ExperimentResult,
//   MessageCodes,
//   ResponseObject,
// } from '@stechy1/diplomka-share';
//
// import { ExperimentResultsService } from 'libs/stim-feature-experiment-results/src/lib/domain/services/experiment-results.service';
// import { ErrorMiddleware } from '../../src/app/error.middleware';
// import { initDbTriggers } from '../../src/app/db-setup';
// import { ExperimentResultsModule } from '../../../../backup/experiment-results/experiment-results.module';
// import { ExperimentResultsRepository } from 'libs/stim-feature-experiment-results/src/lib/domain/repository/experiment-results.repository';
// import {
//   clearDatabase,
//   commonAttributes,
//   createInMemoryTypeOrmModule,
// } from '../test-helpers';
// import { SerialService } from '../../../../backup/low-level/serial.service';
// import { createSerialServiceMock } from '../../../../backup/low-level/serial.service.jest';
// import { ExperimentsService } from 'libs/stim-feature-experiments/src/lib/domain/services/experiments.service';
// import { FileBrowserService } from 'libs/stim-feature-file-browser/src/lib/infrastructure/file-browser.service';
// import { createFileBrowserServiceMock } from '../../../../backup/file-browser/file-browser.service.jest';
// import * as request from 'supertest';
// import { ExperimentsModule } from '../../../../backup/experiments/experiments.module';
// import { ExperimentRepository } from 'libs/stim-feature-experiments/src/lib/domain/repository/experiment.repository';
// import { ExperimentErpRepository } from 'libs/stim-feature-experiments/src/lib/domain/repository/experiment-erp.repository';
// import { ExperimentCvepRepository } from 'libs/stim-feature-experiments/src/lib/domain/repository/experiment-cvep.repository';
// import { ExperimentFvepRepository } from 'libs/stim-feature-experiments/src/lib/domain/repository/experiment-fvep.repository';
// import { ExperimentTvepRepository } from 'libs/stim-feature-experiments/src/lib/domain/repository/experiment-tvep.repository';
// import { ExperimentReaRepository } from 'libs/stim-feature-experiments/src/lib/domain/repository/experiment-rea.repository';
//
// describe('Experiment results integration test', () => {
//   const BASE_API = '/api/experiment-results';
//
//   let app: INestApplication;
//   let httpServer: HttpServer;
//   let experimentResultsService: ExperimentResultsService;
//   let experiment: Experiment;
//
//   beforeAll(() => {
//     process.env.VIRTUAL_SERIAL_SERVICE = 'true';
//   });
//
//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       imports: [
//         createInMemoryTypeOrmModule(),
//         ExperimentResultsModule,
//         ExperimentsModule,
//       ],
//       providers: [
//         ExperimentResultsService,
//         ExperimentResultsRepository,
//         ExperimentsService,
//         ExperimentRepository,
//         ExperimentErpRepository,
//         ExperimentCvepRepository,
//         ExperimentFvepRepository,
//         ExperimentTvepRepository,
//         ExperimentReaRepository,
//         { provide: SerialService, useFactory: createSerialServiceMock },
//         {
//           provide: FileBrowserService,
//           useFactory: createFileBrowserServiceMock,
//         },
//       ],
//     }).compile();
//     let experimentsService: ExperimentsService;
//
//     app = module.createNestApplication();
//     app.useGlobalFilters(new ErrorMiddleware());
//     httpServer = app.getHttpServer();
//     experimentResultsService = module.get<ExperimentResultsService>(
//       ExperimentResultsService
//     );
//     experimentsService = module.get<ExperimentsService>(ExperimentsService);
//
//     await app.init();
//     await initDbTriggers();
//
//     experiment = createEmptyExperimentCVEP();
//     experiment.id = 1;
//     experiment.name = 'test';
//
//     await experimentsService.insert(experiment);
//   });
//
//   it('should be defined', () => {
//     expect(app).toBeDefined();
//   });
//
//   describe('all()', () => {
//     it('positive - should return all existing experiment results', async () => {
//       const expected: ResponseObject<Experiment[]> = { data: [] };
//
//       return request(httpServer).get(BASE_API).expect(200).expect(expected);
//     });
//   });
//
//   describe('experimentResultsById()', () => {
//     it('positive - should return experiment by id', async () => {
//       experimentResultsService.createEmptyExperimentResult(experiment);
//       const experimentResult: ExperimentResult =
//         experimentResultsService.activeExperimentResult;
//       experimentResult.id = 1;
//       await experimentResultsService.insert();
//
//       const expected: ResponseObject<ExperimentResult> = {
//         data: experimentResult,
//       };
//
//       return request(httpServer)
//         .get(`${BASE_API}/${experiment.id}`)
//         .expect(200)
//         .expect(expected);
//     });
//
//     it('negative - should return error code when experiment result not found', async () => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       const expected: ResponseObject<Experiment> = {
//         message: {
//           code: MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND,
//           params: {
//             id: experimentResult.id,
//           },
//         },
//       };
//
//       return request(httpServer)
//         .get(`${BASE_API}/${experimentResult.id}`)
//         .expect(200)
//         .expect(expected);
//     });
//   });
//
//   describe('resultData()', () => {
//     it('positive - should return result data for existing experiment result', async () => {});
//   });
//
//   describe('update()', () => {
//     it('positive - should update experiment result', async () => {
//       experimentResultsService.createEmptyExperimentResult(experiment);
//       const experimentResult: ExperimentResult =
//         experimentResultsService.activeExperimentResult;
//       experimentResult.id = 1;
//       await experimentResultsService.insert();
//
//       experimentResult.name = 'updated';
//       const expected: ResponseObject<ExperimentResult> = {
//         data: experimentResult,
//         message: {
//           code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATED,
//           params: {
//             id: experimentResult.id,
//           },
//         },
//       };
//
//       return request(httpServer)
//         .patch(BASE_API)
//         .send(experimentResult)
//         .expect(200)
//         .expect(expected);
//     });
//
//     it('negative - should not update non existing experiment result', async () => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       const expected: ResponseObject<ExperimentResult> = {
//         message: {
//           code: MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND,
//           params: {
//             id: experimentResult.id,
//           },
//         },
//       };
//
//       return request(httpServer)
//         .patch(BASE_API)
//         .send(experimentResult)
//         .expect(200)
//         .expect(expected);
//     });
//   });
//
//   describe('delete()', () => {
//     it('positive - should delete experiment result', async () => {
//       experimentResultsService.createEmptyExperimentResult(experiment);
//       const experimentResult: ExperimentResult =
//         experimentResultsService.activeExperimentResult;
//       experimentResult.id = 1;
//       await experimentResultsService.insert();
//
//       const expected: ResponseObject<ExperimentResult> = {
//         data: experimentResult,
//         message: {
//           code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_DELETED,
//           params: {
//             id: experimentResult.id,
//           },
//         },
//       };
//
//       return request(httpServer)
//         .delete(`${BASE_API}/${experimentResult.id}`)
//         .expect(200)
//         .expect(expected);
//     });
//
//     it('negative - should not delete non existing experiment result', async () => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       const expected: ResponseObject<ExperimentResult> = {
//         message: {
//           code: MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND,
//           params: {
//             id: experimentResult.id,
//           },
//         },
//       };
//
//       return request(httpServer)
//         .delete(`${BASE_API}/${experimentResult.id}`)
//         .expect(200)
//         .expect(expected);
//     });
//   });
//
//   afterEach(async () => {
//     await clearDatabase();
//     await app.close();
//   });
// });
