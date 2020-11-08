import { IpcMessage } from '../ipc-message';

import { ExperimentAssets } from '@stechy1/diplomka-share';

export class ExperientAssetsMessage implements IpcMessage<ExperimentAssets> {
  public readonly commandID: number;
  public readonly topic = ExperientAssetsMessage.name;
  public readonly data: ExperimentAssets;

  constructor(data: ExperimentAssets, commandID = 0) {
    this.commandID = commandID;
    this.data = data;
  }
}
