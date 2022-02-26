import { IpcCommandType } from '@neuro-server/stim-feature-ipc/domain';
import { BaseBlockingCommand } from '@neuro-server/stim-lib-common';

export type IpcBlockingCommand = BaseBlockingCommand<IpcCommandType>;
