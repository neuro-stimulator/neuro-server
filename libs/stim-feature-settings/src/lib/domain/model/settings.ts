export interface Settings {
  autoconnectToStimulator?: boolean;
  comPortName?: string;
  serial?: Record<string, unknown>;
  stimulatorResponseTimeout?: number;
  assetPlayerResponseTimeout?: number;
  assetPlayer?: {
    width: number;
    height: number;
    fullScreen: boolean;
  };
}
