import { IEvent } from '@nestjs/cqrs';

import { StimulatorData } from '../../../domain/model/stimulator-command-data';

export class StimulatorEvent implements IEvent {
  constructor(public readonly data: StimulatorData) {}
}
