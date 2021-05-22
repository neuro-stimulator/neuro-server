import { SERVER_HTTP_PORT as HTTP_PORT } from '@stechy1/diplomka-share';

const DEFAULT_APP_DATA_ROOT = __dirname;

const SERVER_HTTP_PORT: number = +process.env.PORT || HTTP_PORT;
const FILE_BROWSER_BASE_PATH: string = process.env.APP_DATA_ROOT || DEFAULT_APP_DATA_ROOT;
const TOTAL_OUTPUT_COUNT: number = +process.env.TOTAL_OUTPUT_COUNT || 8;
const VIRTUAL_SERIAL_SERVICE: boolean = process.env.VIRTUAL_SERIAL_SERVICE === 'true';
const ASSET_PLAYER_PYTHON_PATH: string = process.env.ASSET_PLAYER_PYTHON_PATH || '';
const ASSET_PLAYER_MAIN_PATH: string = process.env.ASSET_PLAYER_PATH || '';
const ASSET_PLAYER_AUTO_OPEN_PORT: boolean = process.env.ASSET_PLAYER_OPEN_PORT_AUTOMATICALLY  !== 'false';

export const environment = {
  // environment config
  production: false,
  testing: false,

  // stimulator config
  virtualSerialService: VIRTUAL_SERIAL_SERVICE,
  totalOutputCount: TOTAL_OUTPUT_COUNT,

  // common config
  appDataRoot: FILE_BROWSER_BASE_PATH,
  httpPort: SERVER_HTTP_PORT,
  settingsFilename: 'settings.json',

  // jwt config
  jwtSecretKey: 'SECRET_KEY',
  jwtAccessTokenTTL: 1, // 5 minutes
  jwtRefreshTokenTTL: 5 * 60, // 5 hours
  jwtRefreshTokenLength: 64,

  // asset player
  assetPlayerPythonPath: ASSET_PLAYER_PYTHON_PATH,
  assetPlayerPath: ASSET_PLAYER_MAIN_PATH,
  assetPlayerCommunicationPort: +process.env.ASSET_PLAYER_PORT,
  assetPlayerFrameRate: +process.env.ASSET_PLAYER_FRAME_RATE,
  assetPlayerOpenPortAutomatically: ASSET_PLAYER_AUTO_OPEN_PORT,
};
