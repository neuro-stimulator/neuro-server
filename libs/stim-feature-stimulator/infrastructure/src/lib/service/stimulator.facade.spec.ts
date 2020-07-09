import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import {
  ExperimentClearCommand,
  ExperimentFinishCommand,
  ExperimentPauseCommand,
  ExperimentRunCommand,
  ExperimentSetupCommand,
  ExperimentUploadCommand,
  FirmwareUpdateCommand,
  GetCurrentExperimentIdQuery,
  StimulatorStateCommand,
} from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorActionType, UnknownStimulatorActionTypeException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorFacade } from './stimulator.facade';

describe('SerialController', () => {
  let testingModule: TestingModule;
  let facade: StimulatorFacade;
  let commandBus: MockType<CommandBus>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [StimulatorFacade, commandBusProvider, queryBusProvider],
    }).compile();
    facade = testingModule.get(StimulatorFacade);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateFirmware', () => {
    it('should call ', async () => {
      const path = 'path';

      await facade.updateFirmware(path);

      expect(commandBus.execute).toBeCalledWith(new FirmwareUpdateCommand(path));
    });
  });

  describe('getCurrentExperimentID', () => {
    it('should call ', async () => {
      await facade.getCurrentExperimentID();

      expect(queryBus.execute).toBeCalledWith(new GetCurrentExperimentIdQuery());
    });
  });

  describe('doAction', () => {
    it('should call upload action', async () => {
      const action: StimulatorActionType = 'upload';
      const experimentID = 1;
      const waitForResult = false;

      await facade.doAction(action, experimentID, waitForResult);

      expect(commandBus.execute).toBeCalledWith(new ExperimentUploadCommand(experimentID, waitForResult));
    });

    it('should call setup action', async () => {
      const action: StimulatorActionType = 'setup';
      const experimentID = 1;
      const waitForResult = false;

      await facade.doAction(action, experimentID, waitForResult);

      expect(commandBus.execute).toBeCalledWith(new ExperimentSetupCommand(experimentID, waitForResult));
    });

    it('should call run action', async () => {
      const action: StimulatorActionType = 'run';
      const experimentID = 1;
      const waitForResult = false;

      await facade.doAction(action, experimentID, waitForResult);

      expect(commandBus.execute).toBeCalledWith(new ExperimentRunCommand(experimentID, waitForResult));
    });

    it('should call pause action', async () => {
      const action: StimulatorActionType = 'pause';
      const experimentID = 1;
      const waitForResult = false;

      await facade.doAction(action, experimentID, waitForResult);

      expect(commandBus.execute).toBeCalledWith(new ExperimentPauseCommand(experimentID, waitForResult));
    });

    it('should call finish action', async () => {
      const action: StimulatorActionType = 'finish';
      const experimentID = 1;
      const waitForResult = false;

      await facade.doAction(action, experimentID, waitForResult);

      expect(commandBus.execute).toBeCalledWith(new ExperimentFinishCommand(experimentID, waitForResult));
    });

    it('should call clear action', async () => {
      const action: StimulatorActionType = 'clear';
      const experimentID = 1;
      const waitForResult = false;

      await facade.doAction(action, experimentID, waitForResult);

      expect(commandBus.execute).toBeCalledWith(new ExperimentClearCommand(waitForResult));
    });

    it('negative - should throw exception when unknown action', async (done: DoneCallback) => {
      // @ts-ignore
      const action: StimulatorActionType = 'unknown';
      const experimentID = 1;
      const waitForResult = false;

      try {
        await facade.doAction(action, experimentID, waitForResult);
        done.fail('UnknownStimulatorActionTypeException was not thrown!');
      } catch (e) {
        if (e instanceof UnknownStimulatorActionTypeException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('getState', () => {
    it('should call ', async () => {
      const waitForResponse = false;

      await facade.getState(waitForResponse);

      expect(commandBus.execute).toBeCalledWith(new StimulatorStateCommand(waitForResponse));
    });
  });
});
