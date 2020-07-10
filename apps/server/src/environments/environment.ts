import * as path from 'path';

import { SERVER_HTTP_PORT as HTTP_PORT } from '@stechy1/diplomka-share';

const DEFAULT_APP_DATA_ROOT = __dirname;
const DEFAULT_IPC_NAME = 'pipe.sock';

const SERVER_HTTP_PORT: number = +process.env.HTTP_PORT || HTTP_PORT;
const FILE_BROWSER_BASE_PATH: string = process.env.APP_DATA_ROOT || DEFAULT_APP_DATA_ROOT;
const TOTAL_OUTPUT_COUNT: number = +process.env.TOTAL_OUTPUT_COUNT || 8;

// Trocha magie s nastavením pipy pro meziprocesovou komunikaci
const ipcPipeName = process.env.IPC_PIPE_NAME || DEFAULT_IPC_NAME;
let ipcPath;
if (process.platform === 'win32') {
  ipcPath = `\\\\.\\pipe\\${ipcPipeName}`;
} else {
  ipcPath = path.join(FILE_BROWSER_BASE_PATH, ipcPipeName);
}

export const environment = {
  production: false,
  testing: false,
  virtualSerialService: true,
  appDataRoot: FILE_BROWSER_BASE_PATH,
  httpPort: SERVER_HTTP_PORT,
  ipcPath: ipcPath,
  totalOutputCount: TOTAL_OUTPUT_COUNT,
  settingsFilename: 'settings.json',
};
