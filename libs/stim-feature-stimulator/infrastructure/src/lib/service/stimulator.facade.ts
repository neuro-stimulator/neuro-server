import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  ExperimentClearCommand,
  ExperimentFinishCommand,
  ExperimentPauseCommand,
  ExperimentRunCommand,
  ExperimentSetupCommand,
  ExperimentUploadCommand,
  FirmwareUpdateCommand,
  StimulatorStateCommand,
  GetCurrentExperimentIdQuery,
} from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorActionType, UnknownStimulatorActionTypeException, StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

@Injectable()
export class StimulatorFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async updateFirmware(path: string) {
    return this.commandBus.execute(new FirmwareUpdateCommand(path));
  }

  public async getCurrentExperimentID(): Promise<number> {
    return this.queryBus.execute(new GetCurrentExperimentIdQuery());
  }

  public async doAction(action: StimulatorActionType, experimentID: number, waitForResult: boolean): Promise<StimulatorStateData | any> {
    switch (action) {
      case 'upload':
        return this.commandBus.execute(new ExperimentUploadCommand(experimentID, waitForResult));
      case 'setup':
        return this.commandBus.execute(new ExperimentSetupCommand(experimentID, waitForResult));
      case 'run':
        return this.commandBus.execute(new ExperimentRunCommand(experimentID, waitForResult));
      case 'pause':
        return this.commandBus.execute(new ExperimentPauseCommand(experimentID, waitForResult));
      case 'finish':
        return this.commandBus.execute(new ExperimentFinishCommand(experimentID, waitForResult));
      case 'clear':
        return this.commandBus.execute(new ExperimentClearCommand(waitForResult));
      default:
        throw new UnknownStimulatorActionTypeException(action);
    }
  }

  public async getState(waitForResponse = false): Promise<StimulatorStateData> {
    return this.commandBus.execute(new StimulatorStateCommand(waitForResponse));
  }
}
