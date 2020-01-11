import * as file from 'fs';
import * as path from 'path';

import {
  SERVER_HTTP_PORT as HTTP_PORT,
  SERVER_SOCKET_PORT as SOCKET_PORT
} from '@stechy1/diplomka-share';

interface Config {
  app_data_root?: string;
  http_port?: number;
  socket_port?: number;
  ipc_pipe_name?: string;
}

const configFile = process.argv[2] || 'server-config.json';
const content = file.readFileSync(configFile, { encoding: 'utf-8' });
const config: Config = JSON.parse(content);

console.log(config);

const DEFAULT_APP_DATA_ROOT = `${path.sep}tmp`;
const DEFAULT_IPC_NAME = 'pipe.sock';

export const CONFIG_FILE = configFile;
export const SERVER_HTTP_PORT = config.http_port || HTTP_PORT;
export const SERVER_SOCKET_PORT = config.socket_port || SOCKET_PORT;
export const FILE_BROWSER_BASE_PATH = config.app_data_root || DEFAULT_APP_DATA_ROOT;

// Trocha magie s nastavením pipy pro meziprocesovou komunikaci
const ipcPipeName = config.ipc_pipe_name || DEFAULT_IPC_NAME;
let ipcPath;
if (process.platform === 'win32') {
  ipcPath = `\\\\.\\pipe\\${ipcPipeName}`;
} else {
  ipcPath = path.join(FILE_BROWSER_BASE_PATH, ipcPipeName);
}
export const IPC_PATH = ipcPath;
