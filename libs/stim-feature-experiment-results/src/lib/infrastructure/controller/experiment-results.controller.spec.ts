// import { Test, TestingModule } from '@nestjs/testing';
// import DoneCallback = jest.DoneCallback;
//
// import {
//   createEmptyExperimentCVEP,
//   createEmptyExperimentResult,
//   Experiment,
//   ExperimentResult,
//   MessageCodes,
//   ResponseObject,
// } from '@stechy1/diplomka-share';
//
// import { MockType } from 'apps/server/src/app/test-helpers';
// import { ControllerException } from 'apps/server/src/app/controller-exception';
// import { ExperimentResultsController } from 'libs/stim-feature-experiment-results/src/lib/infrastructure/controller/experiment-results.controller';
// import { ExperimentResultsService } from 'libs/stim-feature-experiment-results/src/lib/domain/services/experiment-results.service';
// import { createExperimentResultsServiceMock } from 'libs/stim-feature-experiment-results/src/lib/domain/services/experiment-results.service.jest';
//
// describe('Experiment results controller', () => {
//   let testingModule: TestingModule;
//   let controller: ExperimentResultsController;
//   let mockExperimentResultsService: MockType<ExperimentResultsService>;
//   let experiment: Experiment;
//
//   beforeEach(async () => {
//     testingModule = await Test.createTestingModule({
//       controllers: [ExperimentResultsController],
//       providers: [
//         {
//           provide: ExperimentResultsService,
//           useFactory: createExperimentResultsServiceMock,
//         },
//       ],
//     }).compile();
//
//     controller = testingModule.get<ExperimentResultsController>(
//       ExperimentResultsController
//     );
//     // @ts-ignore
//     mockExperimentResultsService = testingModule.get<
//       MockType<ExperimentResultsService>
//     >(ExperimentResultsService);
//
//     experiment = createEmptyExperimentCVEP();
//     experiment.id = 1;
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
//
//   describe('all()', () => {
//     it('positive - should return all available experiment results', async () => {
//       mockExperimentResultsService.findAll.mockReturnValue([]);
//
//       const result: ResponseObject<ExperimentResult[]> = await controller.all();
//       const expected: ResponseObject<ExperimentResult[]> = { data: [] };
//
//       expect(result).toEqual(expected);
//     });
//   });
//
//   describe('experimentResultById()', () => {
//     it('positive - should return experiment by id', async () => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       mockExperimentResultsService.byId.mockReturnValue(experimentResult);
//
//       const result: ResponseObject<ExperimentResult> = await controller.experimentResultById(
//         { id: experimentResult.id }
//       );
//       const expected: ResponseObject<ExperimentResult> = {
//         data: experimentResult,
//       };
//
//       expect(result).toEqual(expected);
//     });
//
//     it('negative - should return error code when experiment result not found', async (done: DoneCallback) => {
//       mockExperimentResultsService.byId.mockReturnValue(undefined);
//
//       await controller
//         .experimentResultById({ id: 1 })
//         .then(() => {
//           done.fail();
//         })
//         .catch((exception: ControllerException) => {
//           expect(exception.code).toEqual(
//             MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND
//           );
//           expect(exception.params).toEqual({ id: 1 });
//           done();
//         });
//     });
//   });
//
//   describe('resultData()', () => {
//     it('positive - should return result data', async () => {
//       mockExperimentResultsService.experimentData.mockReturnValue([]);
//
//       const result: ResponseObject<any> = await controller.resultData({
//         id: 1,
//       });
//       const expected: ResponseObject<any> = { data: [] };
//
//       expect(result).toEqual(expected);
//     });
//
//     it('negative - should return error code when experiment result not found', async (done: DoneCallback) => {
//       mockExperimentResultsService.byId.mockReturnValue(undefined);
//
//       await controller
//         .resultData({ id: 1 })
//         .then(() => {
//           done.fail();
//         })
//         .catch((exception: ControllerException) => {
//           expect(exception.code).toEqual(
//             MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_DATA_NOT_FOUND
//           );
//           expect(exception.params).toEqual({ id: 1 });
//           done();
//         });
//     });
//   });
//
//   describe('update()', () => {
//     it('positive - should update experiment result', async () => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//
//       mockExperimentResultsService.update.mockReturnValue(experimentResult);
//
//       const result: ResponseObject<ExperimentResult> = await controller.update(
//         experimentResult
//       );
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
//       expect(result).toEqual(expected);
//     });
//
//     it('negative - should return error code when experiment result not found', async (done: DoneCallback) => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       await controller
//         .update(experimentResult)
//         .then(() => {
//           done.fail();
//         })
//         .catch((exception: ControllerException) => {
//           expect(exception.code).toEqual(
//             MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND
//           );
//           expect(exception.params).toEqual({ id: experimentResult.id });
//           done();
//         });
//     });
//   });
//
//   describe('delete()', () => {
//     it('positive - should delete experiment result', async () => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       mockExperimentResultsService.delete.mockReturnValue(experimentResult);
//
//       const result: ResponseObject<ExperimentResult> = await controller.delete({
//         id: experimentResult.id,
//       });
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
//       expect(result).toEqual(expected);
//     });
//
//     it('negative - should return error code when experiment result not found', async (done: DoneCallback) => {
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       experimentResult.id = 1;
//
//       await controller
//         .delete({ id: experimentResult.id })
//         .then(() => {
//           done.fail();
//         })
//         .catch((exception: ControllerException) => {
//           expect(exception.code).toEqual(
//             MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND
//           );
//           expect(exception.params).toEqual({ id: experimentResult.id });
//           done();
//         });
//     });
//   });
// });
