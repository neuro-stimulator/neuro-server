import { ExperimentStopCondition } from '@diplomka-backend/stim-feature-player/domain';

export class ExperimentResultInitializeCommand {
  constructor(
    public readonly experimentID: number,
    public readonly experimentStopCondition: ExperimentStopCondition,
    public readonly experimentRepeat: number,
    public readonly betweenExperimentInterval: number,
    public readonly autoplay: boolean
  ) {}
}
