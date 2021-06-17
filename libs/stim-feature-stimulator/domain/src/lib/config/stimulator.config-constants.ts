import { createKey } from '@diplomka-backend/stim-lib-config';

export const STIMULATOR_MODULE_CONFIG_CONSTANT = 'STIMULATOR_MODULE_CONFIG_CONSTANT';
export const STIMULATOR_CONFIG_PREFIX = 'stimulator';

export const KEY__VIRTUAL_SERIAL_SERVICE = createKey<boolean>('virtualSerialService', Boolean, { use: 'optional'});
export const KEY__TOTAL_OUTPUT_COUNT = createKey<number>('totalOutputCount', Number, { use: 'optional'});
