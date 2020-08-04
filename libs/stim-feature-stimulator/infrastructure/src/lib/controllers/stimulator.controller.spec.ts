import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { FileAccessRestrictedException, FileNotFoundException } from '@diplomka-backend/stim-feature-file-browser';
import { ControllerException } from '@diplomka-backend/stim-lib-common';
import {
  FirmwareUpdateFailedException,
  PortIsNotOpenException,
  StimulatorActionType,
  StimulatorStateData,
  UnknownStimulatorActionTypeException,
} from '@diplomka-backend/stim-feature-stimulator/domain';

import { MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { createStimulatorFacadeMock } from '../service/stimulator.facade.jest';
import { StimulatorFacade } from '../service/stimulator.facade';
import { StimulatorController } from './stimulator.controller';

describe('StimulatoController', () => {
  let testingModule: TestingModule;
  let controller: StimulatorController;
  let mockStimulatorFacade: MockType<StimulatorFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [StimulatorController],
      providers: [
        {
          provide: StimulatorFacade,
          useFactory: createStimulatorFacadeMock,
        },
        queryBusProvider, // Kvůli stimulator-action.guard
      ],
    }).compile();
    controller = testingModule.get(StimulatorController);
    // @ts-ignore
    mockStimulatorFacade = testingModule.get<MockType<StimulatorFacade>>(StimulatorFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateFirmware()', () => {
    it('positive - should update firmware', async () => {
      const body = { path: 'valid/path' };

      const result: ResponseObject<any> = await controller.updateFirmware(body);
      const expected: ResponseObject<any> = { message: { code: MessageCodes.CODE_SUCCESS_LOW_LEVEL_FIRMWARE_UPDATED } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when file access is restricted', async (done: DoneCallback) => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new FileAccessRestrictedException(body.path);
      });

      try {
        await controller.updateFirmware(body);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED);
          expect(e.params).toEqual({ restrictedPath: body.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when file not found', async (done: DoneCallback) => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new FileNotFoundException(body.path);
      });

      try {
        await controller.updateFirmware(body);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
          expect(e.params).toEqual(body);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when firmware update failed', async (done: DoneCallback) => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new FirmwareUpdateFailedException();
      });

      try {
        await controller.updateFirmware(body);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_STIMULATOR_FIRMWARE_NOT_UPDATED);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.updateFirmware(body);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('experimentAction()', () => {
    it('positive - should handle experiment action', async () => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const asyncStimulatorRequest = false;

      mockStimulatorFacade.doAction.mockReturnValue(undefined);

      const result: ResponseObject<any> = await controller.experimentAction(action, experimentID, asyncStimulatorRequest);
      const expected: ResponseObject<any> = {};

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when port is not open', async (done: DoneCallback) => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const asyncStimulatorRequest = false;

      mockStimulatorFacade.doAction.mockImplementation(() => {
        throw new PortIsNotOpenException();
      });

      try {
        await controller.experimentAction(action, experimentID, asyncStimulatorRequest);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when unknown stimulator action type', async (done: DoneCallback) => {
      // @ts-ignore
      const action: StimulatorActionType = 'unknown';
      const experimentID = 1;
      const asyncStimulatorRequest = false;

      mockStimulatorFacade.doAction.mockImplementation(() => {
        throw new UnknownStimulatorActionTypeException(action);
      });

      try {
        await controller.experimentAction(action, experimentID, asyncStimulatorRequest);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_STIMULATOR_UNKNOWN_ACTION);
          expect(e.params).toEqual({ action });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const asyncStimulatorRequest = false;

      mockStimulatorFacade.doAction.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.experimentAction(action, experimentID, asyncStimulatorRequest);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('getStimulatorState()', () => {
    it('positive - should return stimulator state', async () => {
      const state: StimulatorStateData = { state: 0, name: 'name', noUpdate: false, timestamp: 0 };

      mockStimulatorFacade.getState.mockReturnValue(state);

      const result: ResponseObject<StimulatorStateData> = await controller.getStimulatorState(true);
      const expected: ResponseObject<StimulatorStateData> = { data: state };

      expect(result).toEqual(expected);
    });

    it('positive - should not return a stimulator state', async () => {
      mockStimulatorFacade.getState.mockReturnValue(undefined);

      const result: ResponseObject<any> = await controller.getStimulatorState(false);
      const expected: ResponseObject<any> = {};

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      mockStimulatorFacade.getState.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.getStimulatorState(true);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
