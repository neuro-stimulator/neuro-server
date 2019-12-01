// Oddělovač konce příkazu
// Podle tohoto znaku pozná seriová linka na stimulátoru,
// že může buffer zpracovat
export const COMMAND_DELIMITER = 0x53;

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

export const COMMAND_EXPERIMENT_SETUP = 0x10;


// TODO tohle tu nebude
export const COMMAND_STIMUL_CONFIG = 0x04;

