import { IpcMessage } from '../ipc-message';

export class OutputSynchronizationMessage implements IpcMessage<{ success: boolean }> {
  public readonly commandID: number;
  public readonly topic = OutputSynchronizationMessage.name;
  public readonly data: { success: boolean };
}
