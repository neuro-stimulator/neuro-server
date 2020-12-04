import { SERVER_HTTP_PORT as HTTP_PORT } from '@stechy1/diplomka-share/lib/config';

const DEFAULT_APP_DATA_ROOT = __dirname;

const SERVER_HTTP_PORT: number = +process.env.HTTP_PORT || HTTP_PORT;
const FILE_BROWSER_BASE_PATH: string = process.env.APP_DATA_ROOT || DEFAULT_APP_DATA_ROOT;
const TOTAL_OUTPUT_COUNT: number = +process.env.TOTAL_OUTPUT_COUNT || 8;
const VIRTUAL_SERIAL_SERVICE: boolean = process.env.VIRTUAL_SERIAL_SERVICE === 'true';

export const environment = {
  production: true,
  testing: false,
  virtualSerialService: VIRTUAL_SERIAL_SERVICE,
  appDataRoot: FILE_BROWSER_BASE_PATH,
  httpPort: SERVER_HTTP_PORT,
  totalOutputCount: TOTAL_OUTPUT_COUNT,
  settingsFilename: 'settings.json',
};
