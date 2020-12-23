import * as path from 'path';

process.env.VIRTUAL_SERIAL_SERVICE = 'true';
process.env.TESTING = 'true';
process.env.SETUP_SEED_DATABASE = 'false';
process.env.ASSET_PLAYER_PYTHON_PATH = 'tmp';
process.env.ASSET_PLAYER_PATH = 'path';
process.env.ASSET_PLAYER_FRAME_RATE = '60';
process.env.ASSET_PLAYER_OPEN_PORT_AUTOMATICALLY = 'false';
process.env.APP_DATA_ROOT = path.join(__dirname, '../../../dist/apps/server');

// globální proměnné pouze pro test
process.env.DEFAULT_USER_PASSWORD = '1234567890';

jest.setTimeout(10000);
