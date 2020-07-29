import { ICommand } from '@nestjs/cqrs';

import { ExperimentEndConditionType, PlayerConfigurationDTO } from '@diplomka-backend/stim-feature-player/domain';

export class PrepareExperimentPlayerCommand implements ICommand {
  constructor(public readonly experimentID: number, public readonly conditionType: ExperimentEndConditionType, public readonly playerConfiguration: PlayerConfigurationDTO) {}
}
