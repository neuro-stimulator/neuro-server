import { IEvent } from '@nestjs/cqrs';

import { IpcCommandType } from '@neuro-server/stim-feature-ipc/domain';

export class IpcBlockingCommandFailedEvent implements IEvent {
  constructor(public readonly message: IpcCommandType) {}
}
