export interface Settings {
  autoconnectToStimulator?: boolean;
  comPortName?: string;
  serial?: Record<string, unknown>;
  stimulatorResponseTimeout?: number;
}
