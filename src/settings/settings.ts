import SerialPort = require('serialport');

export interface Settings {
  autoconnectToStimulator?: boolean;
  comPortName?: string;
  serial?: SerialPort.OpenOptions;
}
