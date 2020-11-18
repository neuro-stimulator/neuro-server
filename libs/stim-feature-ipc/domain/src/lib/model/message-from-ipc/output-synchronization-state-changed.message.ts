import { IpcMessage } from '../ipc-message';

export class OutputSynchronizationStateChangedMessage implements IpcMessage<{ success: boolean; synchronize: boolean }> {
  public readonly commandID: number;
  public readonly topic = OutputSynchronizationStateChangedMessage.name;
  public readonly data: { success: boolean; synchronize: boolean };
}
