import { SERVER_HTTP_PORT as HTTP_PORT } from '@stechy1/diplomka-share';

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
  assetPlayerPythonPath: process.env.ASSET_PLAYER_PYTHON_PATH,
  assetPlayerPath: process.env.ASSET_PLAYER_PATH,
  assetPlayerCommunicationPort: +process.env.ASSET_PLAYER_PORT,
  assetPlayerFrameRate: +process.env.ASSET_PLAYER_FRAME_RATE,
};
