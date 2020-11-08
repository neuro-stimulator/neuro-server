import { IpcMessage } from '../ipc-message';

export class StimulatorStateChangeMessage implements IpcMessage<{ state: number }> {
  public readonly commandID: number;
  public readonly topic = StimulatorStateChangeMessage.name;
  public readonly data: { state: number };

  constructor(state: number, commandID = 0) {
    this.commandID = commandID;
    this.data = { state };
  }
}
