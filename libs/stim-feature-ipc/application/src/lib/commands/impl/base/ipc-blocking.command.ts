import { BaseBlockingCommand } from '@diplomka-backend/stim-lib-common';
import { IpcCommandType } from '@diplomka-backend/stim-feature-ipc/domain';

export type IpcBlockingCommand = BaseBlockingCommand<IpcCommandType>;
