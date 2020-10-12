export interface IpcMessage<T> {
  readonly topic: string;
  readonly data: T;
}

export class StimulatorStateChangeMessage implements IpcMessage<{ state: number }> {
  public readonly topic = StimulatorStateChangeMessage.name;
  public readonly data: { state: number };

  constructor(state: number) {
    this.data = { state };
  }
}

export class ServerPublicPathMessage implements IpcMessage<{ publicPath: string }> {
  public readonly topic = ServerPublicPathMessage.name;
  public readonly data: { publicPath: string };

  constructor(publicPath: string) {
    this.data = { publicPath };
  }
}

export class ExperientAssetsMessage implements IpcMessage<any> {
  public readonly topic = ExperientAssetsMessage.name;
  public readonly data: any;

  constructor(data: any) {
    this.data = data;
  }
}

export class ToggleOutputMessage implements IpcMessage<{ index: number }> {
  public readonly topic = ToggleOutputMessage.name;
  public readonly data: { index: number };

  constructor(index: number) {
    this.data = { index };
  }
}
