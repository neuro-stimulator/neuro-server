import * as SerialPort from 'serialport';

export interface Settings {
  autoconnectToStimulator?: boolean;
  comPortName?: string;
  serial?: SerialPort.OpenOptions;
  stimulatorResponseTimeout?: number;
}
