import { Test, TestingModule } from '@nestjs/testing';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { FileAccessRestrictedException, FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';
import {
  FirmwareUpdateFailedException,
  PortIsNotOpenException,
  StimulatorActionType,
  StimulatorStateData,
  UnknownStimulatorActionTypeException,
} from '@neuro-server/stim-feature-stimulator/domain';
import { ControllerException } from '@neuro-server/stim-lib-common';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorFacade } from '../service/stimulator.facade';
import { createStimulatorFacadeMock } from '../service/stimulator.facade.jest';

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
    testingModule.useLogger(new NoOpLogger());
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

    it('negative - should throw exception when file access is restricted', () => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new FileAccessRestrictedException(body.path);
      });

      expect(() => controller.updateFirmware(body))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED, { restrictedPath: body.path}));
    });

    it('negative - should throw exception when file not found', () => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new FileNotFoundException(body.path);
      });

      expect(() => controller.updateFirmware(body)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND, { body }));
    });

    it('negative - should throw exception when firmware update failed', () => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new FirmwareUpdateFailedException();
      });

      expect(() => controller.updateFirmware(body)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_FIRMWARE_NOT_UPDATED));
    });

    it('negative - should throw exception when unknown error occured', () => {
      const body = { path: 'valid/path' };

      mockStimulatorFacade.updateFirmware.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.updateFirmware(body)).rejects.toThrow(new ControllerException());
    });
  });

  describe('experimentAction()', () => {
    it('positive - should handle experiment action', async () => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const asyncStimulatorRequest = false;
      const userGroups = [1];
      const force = false;

      mockStimulatorFacade.doAction.mockReturnValue(undefined);

      const result: ResponseObject<any> = await controller.experimentAction(action, experimentID, userGroups, asyncStimulatorRequest, force);
      const expected: ResponseObject<any> = {};

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when port is not open', () => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const asyncStimulatorRequest = false;
      const userGroups = [1];
      const force = false;

      mockStimulatorFacade.doAction.mockImplementation(() => {
        throw new PortIsNotOpenException();
      });

      expect(() => controller.experimentAction(action, experimentID, userGroups, asyncStimulatorRequest, force))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN));
    });

    it('negative - should throw exception when unknown stimulator action type', () => {
      // @ts-ignore
      const action: StimulatorActionType = 'unknown';
      const experimentID = 1;
      const asyncStimulatorRequest = false;
      const userGroups = [1];
      const force = false;

      mockStimulatorFacade.doAction.mockImplementation(() => {
        throw new UnknownStimulatorActionTypeException(action);
      });

      expect(() => controller.experimentAction(action, experimentID, userGroups, asyncStimulatorRequest, force))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_UNKNOWN_ACTION, { action }));
    });

    it('negative - should throw exception when unknown error occured', () => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const asyncStimulatorRequest = false;
      const userGroups = [1];
      const force = false;

      mockStimulatorFacade.doAction.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.experimentAction(action, experimentID, userGroups, asyncStimulatorRequest, force))
      .rejects.toThrow(new ControllerException());
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

    it('negative - should throw exception when port is not open', () => {
      mockStimulatorFacade.getState.mockImplementation(() => {
        throw new PortIsNotOpenException();
      });

      expect(() => controller.getStimulatorState(true))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN));
    });

    it('negative - should throw exception when unknown error occured', () => {
      mockStimulatorFacade.getState.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.getStimulatorState(true)).rejects.toThrow(new ControllerException());
    });
  });

  describe('setOutput()', () => {
    it('positive - should set one output', async () => {
      const index = 0;
      const enabled = false;
      const asyncStimulatorRequest = false;

      const result: ResponseObject<void> = await controller.setOutput({ index, enabled }, asyncStimulatorRequest);
      const expected: ResponseObject<void> = { message: { code: 0 } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when port is not open', () => {
      const index = 0;
      const enabled = false;
      const asyncStimulatorRequest = false;

      mockStimulatorFacade.setOutput.mockImplementation(() => {
        throw new PortIsNotOpenException();
      });

      expect(() => controller.setOutput({ index, enabled }, asyncStimulatorRequest))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN));
    });

    it('negative - should throw exception when unknown error occured', () => {
      const index = 0;
      const enabled = false;
      const asyncStimulatorRequest = false;

      mockStimulatorFacade.setOutput.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.setOutput({ index, enabled }, asyncStimulatorRequest))
      .rejects.toThrow(new ControllerException());
    });
  });
});
