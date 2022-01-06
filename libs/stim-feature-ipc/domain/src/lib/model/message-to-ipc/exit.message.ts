import { IpcMessage } from '../ipc-message';

export class ExitMessage implements IpcMessage<void> {

  public readonly commandID: number;
  public readonly topic = ExitMessage.name;
  public readonly data = null;

  constructor(commandID = 0) {
    this.commandID = commandID;
  }
}
