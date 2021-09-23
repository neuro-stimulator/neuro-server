import { IEvent } from '@nestjs/cqrs';

export class IpcOutputSynchronizationUpdatedEvent implements IEvent {
  constructor(public readonly synchronize: boolean, public readonly userGroups?: number[], public readonly experimentID?: number) {}
}
