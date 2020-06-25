import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ExperimentClearCommand } from '../../application/commands/impl/experiment-clear.command';
import { ExperimentFinishCommand } from '../../application/commands/impl/experiment-finish.command';
import { ExperimentPauseCommand } from '../../application/commands/impl/experiment-pause.command';
import { ExperimentRunCommand } from '../../application/commands/impl/experiment-run.command';
import { ExperimentSetupCommand } from '../../application/commands/impl/experiment-setup.command';
import { ExperimentUploadCommand } from '../../application/commands/impl/experiment-upload.command';
import { FirmwareUpdateCommand } from '../../application/commands/impl/firmware-update.command';
import { StimulatorStateCommand } from '../../application/commands/impl/stimulator-state.command';
import { GetCurrentExperimentIdQuery } from '../../application/queries/impl/get-current-experiment-id.query';
import { StimulatorActionType } from '../../domain/model/stimulator-action-type';
import { UnknownStimulatorActionTypeException } from '../../domain/exception/unknown-stimulator-action-type.exception';
import { StimulatorStateData } from '../../domain/model/stimulator-command-data/stimulator-state.data';

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
