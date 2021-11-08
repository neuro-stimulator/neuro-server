import { IpcMessage } from '@neuro-server/stim-feature-ipc/domain';

export class IpcEvent<DType> implements IpcMessage<IpcMessage<DType>> {
  public readonly commandID: number;
  public readonly data: IpcMessage<DType>;
  public readonly topic: string;

  constructor(message: IpcMessage<DType>) {
    this.commandID = message.commandID;
    this.data = message;
    this.topic = message.topic;
  }
}
