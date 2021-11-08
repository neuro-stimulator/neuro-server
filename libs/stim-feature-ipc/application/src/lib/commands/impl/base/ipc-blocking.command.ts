import { BaseBlockingCommand } from '@neuro-server/stim-lib-common';
import { IpcCommandType } from '@neuro-server/stim-feature-ipc/domain';

export type IpcBlockingCommand = BaseBlockingCommand<IpcCommandType>;
