import { COMMAND_DELIMITER_SHARE } from '../../share/protocol.share';

// Oddělovač konce příkazu
// Podle tohoto znaku pozná seriová linka na stimulátoru,
// že může buffer zpracovat
export const COMMAND_DELIMITER = COMMAND_DELIMITER_SHARE;

export const COMMAND_STIMULATOR_STATE = 0x01;

export const COMMAND_OUTPUT_ACTIVATED = 0x10;
export const COMMAND_OUTPUT_DEACTIVATED = 0x11;
export const COMMAND_INPUT_ACTIVATED = 0x12;
