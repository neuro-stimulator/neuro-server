import { IpcMessage } from '../ipc-message';

export class ToggleOutputMessage implements IpcMessage<{ index: number }> {
  public readonly commandID: number;
  public readonly topic = ToggleOutputMessage.name;
  public readonly data: { index: number };

  constructor(index: number, commandID = 0) {
    this.commandID = commandID;
    this.data = { index };
  }
}
