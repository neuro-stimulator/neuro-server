import { ExperimentEndCondition } from '@diplomka-backend/stim-feature-player/domain';

export class ExperimentResultInitializeCommand {
  constructor(
    public readonly experimentID: number,
    public readonly experimentEndCondition: ExperimentEndCondition,
    public readonly experimentRepeat: number,
    public readonly betweenExperimentInterval: number
  ) {}
}
