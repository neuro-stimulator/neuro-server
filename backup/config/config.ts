import * as path from 'path';

import {
  SERVER_HTTP_PORT as HTTP_PORT,
} from '@stechy1/diplomka-share';

const DEFAULT_APP_DATA_ROOT = `${path.sep}tmp`;
const DEFAULT_IPC_NAME = 'pipe.sock';

export const SERVER_HTTP_PORT: number = +process.env.HTTP_PORT || HTTP_PORT;
export const FILE_BROWSER_BASE_PATH: string = process.env.APP_DATA_ROOT || DEFAULT_APP_DATA_ROOT;
export const TOTAL_OUTPUT_COUNT: number = +process.env.TOTAL_OUTPUT_COUNT || 8;

// Trocha magie s nastavením pipy pro meziprocesovou komunikaci
const ipcPipeName = process.env.IPC_PIPE_NAME || DEFAULT_IPC_NAME;
let ipcPath;
if (process.platform === 'win32') {
  ipcPath = `\\\\.\\pipe\\${ipcPipeName}`;
} else {
  ipcPath = path.join(FILE_BROWSER_BASE_PATH, ipcPipeName);
}
export const IPC_PATH = ipcPath;
