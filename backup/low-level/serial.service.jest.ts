import { MockType } from 'apps/server/src/app/test-helpers';
import { SerialService } from 'backup/low-level/serial.service';

export const createSerialServiceMock: () => MockType<SerialService> = jest.fn(
  () => ({
    discover: jest.fn(),
    open: jest.fn(),
    close: jest.fn(),
    write: jest.fn(),
    bindEvent: jest.fn(),
    unbindEvent: jest.fn(),
    tryAutoopenComPort: jest.fn(),
    registerMessagePublisher: jest.fn(),
    publishMessage: jest.fn(),
    isConnected: jest.fn(),
  })
);
