import { IEvent } from '@nestjs/cqrs';

import { IpcCommandType } from '@diplomka-backend/stim-feature-ipc/domain';

export class IpcBlockingCommandFailedEvent implements IEvent {
  constructor(public readonly message: IpcCommandType) {}
}
