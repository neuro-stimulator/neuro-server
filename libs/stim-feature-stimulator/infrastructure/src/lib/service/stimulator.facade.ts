import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { GetCurrentSequenceQuery } from '@neuro-server/stim-feature-player/application';
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
  LastKnowStimulatorStateQuery,
  StimulatorSetOutputCommand,
} from '@neuro-server/stim-feature-stimulator/application';
import { StimulatorActionType, UnknownStimulatorActionTypeException, StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

@Injectable()
export class StimulatorFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async updateFirmware(path: string): Promise<void> {
    return this.commandBus.execute(new FirmwareUpdateCommand(path));
  }

  public async getCurrentExperimentID(): Promise<number> {
    return this.queryBus.execute(new GetCurrentExperimentIdQuery());
  }

  public async doAction(
    action: StimulatorActionType,
    experimentID: number,
    waitForResult: boolean,
    force: boolean,
    userGroups: number[]
  ): Promise<StimulatorStateData | Record<string, unknown>> {
    switch (action) {
      case 'upload': {
        const sequence: Sequence = await this.queryBus.execute(new GetCurrentSequenceQuery());
        return this.commandBus.execute(new ExperimentUploadCommand(userGroups, experimentID, sequence?.size, waitForResult));
      }
      case 'setup':
        return this.commandBus.execute(new ExperimentSetupCommand(experimentID, waitForResult));
      case 'run':
        return this.commandBus.execute(new ExperimentRunCommand(experimentID, waitForResult));
      case 'pause':
        return this.commandBus.execute(new ExperimentPauseCommand(experimentID, waitForResult));
      case 'finish':
        return this.commandBus.execute(new ExperimentFinishCommand(experimentID, waitForResult, force));
      case 'clear':
        return this.commandBus.execute(new ExperimentClearCommand(waitForResult));
      default:
        throw new UnknownStimulatorActionTypeException(action);
    }
  }

  public async getState(waitForResponse = false): Promise<StimulatorStateData> {
    return this.commandBus.execute(new StimulatorStateCommand(waitForResponse));
  }

  public async getLastKnowStimulatorState(): Promise<number> {
    return this.queryBus.execute(new LastKnowStimulatorStateQuery());
  }

  public async setOutput(index: number, enabled: boolean, waitForResponse = false): Promise<void> {
    return this.commandBus.execute(new StimulatorSetOutputCommand(index, enabled, waitForResponse));
  }
}
