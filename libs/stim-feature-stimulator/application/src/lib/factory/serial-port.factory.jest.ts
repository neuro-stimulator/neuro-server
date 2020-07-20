import { MockType } from 'test-helpers/test-helpers';

import { SerialPortFactory } from './serial-port.factory';
import { SerialPort } from '@diplomka-backend/stim-feature-stimulator/domain';

// @ts-ignore
export const createSerialPortFactoryMock: () => MockType<SerialPortFactory> = jest.fn(() => ({
  createSerialPort: jest.fn().mockImplementation((path: string, settings: any, callback: (error) => void) => {
    setTimeout(() => {
      callback(null);
    }, 1000);
    return serialPortMock;
  }),
  list: jest.fn(),
}));

export const serialPortMock: MockType<SerialPort> = {
  on: jest.fn(),
  close: jest.fn(),
  pipe: jest.fn().mockReturnThis(),
  write: jest.fn(),
};
