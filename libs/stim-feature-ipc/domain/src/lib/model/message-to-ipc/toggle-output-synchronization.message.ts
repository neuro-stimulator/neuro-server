import { IpcMessage } from '../ipc-message';

export class ToggleOutputSynchronizationMessage implements IpcMessage<{ synchronize: boolean }> {
  public readonly commandID: number;
  public readonly topic = ToggleOutputSynchronizationMessage.name;
  public readonly data: { synchronize: boolean };

  constructor(synchronize: boolean, commandID = 0) {
    this.commandID = commandID;
    this.data = { synchronize };
  }
}
