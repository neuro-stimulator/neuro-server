import { COMMAND_DELIMITER_SHARE } from '../../share/protocol.share';

// Oddělovač konce příkazu
// Podle tohoto znaku pozná seriová linka na stimulátoru,
// že může buffer zpracovat
export const COMMAND_DELIMITER = COMMAND_DELIMITER_SHARE;

// Příkaz pro reboot stimulátoru
export const COMMAND_REBOOT = 0x00;

// Příkaz pro nastavení času
export const COMMAND_TIME_SET = 0x01;

// Příkaz pro nastavení displaye
export const COMMAND_DISPLAY = 0x02;
export const COMMAND_DISPLAY_ACTION_CLEAR = 0x00;
export const COMMAND_DISPLAY_ACTION_SET = 0x01;

// Příkaz pro správu experimentu
export const COMMAND_MANAGE_EXPERIMENT = 0x03;
export const COMMAND_MANAGE_EXPERIMENT_STOP = 0x00;
export const COMMAND_MANAGE_EXPERIMENT_RUN = 0x01;
export const COMMAND_MANAGE_EXPERIMENT_INIT = 0x02;
export const COMMAND_MANAGE_EXPERIMENT_CLEAR = 0x03;
export const COMMAND_MANAGE_EXPERIMENT_READY = 0x05;


export const COMMAND_EXPERIMENT_SETUP = 0x10;


// Backdoor do stimulatoru
export const COMMAND_BACKDOR_1 = 0xF0;
