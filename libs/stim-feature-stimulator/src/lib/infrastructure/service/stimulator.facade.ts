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
} from '../../application/commands';
import { GetCurrentExperimentIdQuery } from '../../application/queries';
import { StimulatorActionType } from '../../domain/model/stimulator-action-type';
import { UnknownStimulatorActionTypeException } from '../../domain/exception';
import { StimulatorStateData } from '../../domain/model/stimulator-command-data';

@Injectable()
export class StimulatorFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async updateFirmware(path: string) {
    return this.commandBus.execute(new FirmwareUpdateCommand(path));
  }

  async getCurrentExperimentID(): Promise<number> {
    return this.queryBus.execute(new GetCurrentExperimentIdQuery());
  }

  async doAction(
    action: StimulatorActionType,
    experimentID: number,
    waitForResult: boolean
  ): Promise<StimulatorStateData | any> {
    switch (action) {
      case 'upload':
        return this.commandBus.execute(
          new ExperimentUploadCommand(experimentID, waitForResult)
        );
      case 'setup':
        return this.commandBus.execute(
          new ExperimentSetupCommand(experimentID, waitForResult)
        );
      case 'run':
        return this.commandBus.execute(
          new ExperimentRunCommand(experimentID, waitForResult)
        );
      case 'pause':
        return this.commandBus.execute(
          new ExperimentPauseCommand(experimentID, waitForResult)
        );
      case 'finish':
        return this.commandBus.execute(
          new ExperimentFinishCommand(experimentID, waitForResult)
        );
      case 'clear':
        return this.commandBus.execute(
          new ExperimentClearCommand(waitForResult)
        );
      default:
        throw new UnknownStimulatorActionTypeException(action);
    }
  }

  async getState(waitForResponse = false): Promise<StimulatorStateData> {
    return this.commandBus.execute(new StimulatorStateCommand(waitForResponse));
  }
}
