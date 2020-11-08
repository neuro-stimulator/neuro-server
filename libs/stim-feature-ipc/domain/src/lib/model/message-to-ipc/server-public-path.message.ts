import { IpcMessage } from '../ipc-message';

export class ServerPublicPathMessage implements IpcMessage<{ publicPath: string }> {
  public readonly commandID: number;
  public readonly topic = ServerPublicPathMessage.name;
  public readonly data: { publicPath: string };

  constructor(publicPath: string, commandID = 0) {
    this.commandID = commandID;
    this.data = { publicPath };
  }
}
