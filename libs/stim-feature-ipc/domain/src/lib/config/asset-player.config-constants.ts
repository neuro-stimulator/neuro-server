import { createKey } from '@neuro-server/stim-lib-config';

export const ASSET_PLAYER_MODULE_CONFIG_CONSTANT = 'ASSET_PLAYER_MODULE_CONFIG_CONSTANT';
export const ASSET_PLAYER_CONFIG_PREFIX = 'assetPlayer';

export const KEY__PYTHON_PATH = createKey<string>('pythonPath', String);
export const KEY__PATH = createKey<string>('path', String);
export const KEY__COMMUNICATION_PORT = createKey<number>('communicationPort', Number);
export const KEY__FRAME_RATE = createKey<number>('frameRate', Number);
export const KEY__OPEN_PORT_AUTOMATICALLY = createKey<boolean>('openPortAutomatically', Boolean);
