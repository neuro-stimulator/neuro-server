import { ICommand } from '@nestjs/cqrs';

import { ExperimentAssets } from '@stechy1/diplomka-share';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcSetExperimentAssetCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'experiment-asset';

  constructor(public readonly data: ExperimentAssets, public readonly waitForResponse = false) {}
}
