import { IpcMessage } from '../ipc-message';

export class UpdateOutputDataMessage implements IpcMessage<{ id: string; x: number; y: number; type: 'image' | 'audio' }> {
  public readonly commandID = 0;
  public readonly topic = UpdateOutputDataMessage.name;
  public readonly data: { id: string; x: number; y: number; type: 'image' | 'audio' };

  constructor(id: string, x: number, y: number) {
    this.data = { id: `${id}`, x, y, type: 'image' };
  }
}
