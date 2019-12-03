import { ExperimentType,
  Experiment, ExperimentERP, ExperimentCVEP, ExperimentFVEP, ExperimentTVEP } from 'diplomka-share';

import * as commands from './commands.protocol';
import * as serializer from './experiments.protocol';

function stringToBytes(text: string): number[] {
  const bytes = [];
  const length = text.length;
  for (let i = 0; i < length; i++) {
    bytes.push(text.charCodeAt(i));
  }

  return bytes;
}

export function bufferCommandREBOOT(): Buffer {
  return Buffer.from(Uint8Array.from([
    commands.COMMAND_REBOOT,
    commands.COMMAND_DELIMITER]));
}

export function bufferCommandTIME_SET(time: number): Buffer {
  return Buffer.from(Uint8Array.from([
    commands.COMMAND_TIME_SET,
    time, time << 8, time << 16, time << 24,
    commands.COMMAND_DELIMITER]));
}

export function bufferCommandDISPLAY_CLEAR(): Buffer {
  return Buffer.from(Uint8Array.from([
    commands.COMMAND_DISPLAY,
    commands.COMMAND_DISPLAY_ACTION_CLEAR,
    commands.COMMAND_DELIMITER]));
}

export function bufferCommandDISPLAY_SET(x: number, y: number, text: string): Buffer {
  const bytes = [
    commands.COMMAND_DISPLAY,
    commands.COMMAND_DISPLAY_ACTION_SET, x, y];

  const textBytes = stringToBytes(text);
  bytes.concat(textBytes);

  bytes.push(commands.COMMAND_DELIMITER);
  return Buffer.from(Uint8Array.from(bytes));
}

export function bufferCommandMANAGE_EXPERIMENT(running: boolean): Buffer {
  return Buffer.from(Uint8Array.from([
    commands.COMMAND_MANAGE_EXPERIMENT,
    running ? commands.COMMAND_MANAGE_EXPERIMENT_RUN : commands.COMMAND_MANAGE_EXPERIMENT_STOP,
    commands.COMMAND_DELIMITER
  ]));
}

export function bufferCommandINIT_EXPERIMENT(): Buffer {
  return Buffer.from(Uint8Array.from([
    commands.COMMAND_MANAGE_EXPERIMENT,
    commands.COMMAND_MANAGE_EXPERIMENT_INIT,
    commands.COMMAND_DELIMITER
  ]));
}

export function bufferCommandCLEAR_EXPERIMENT(): Buffer {
  return Buffer.from(Uint8Array.from([
    commands.COMMAND_MANAGE_EXPERIMENT,
    commands.COMMAND_MANAGE_EXPERIMENT_CLEAR,
    commands.COMMAND_DELIMITER
  ]));
}

export function bufferCommandEXPERIMENT_SETUP(experiment: Experiment): Buffer {
  let bytes = [commands.COMMAND_EXPERIMENT_SETUP];
  // 1. parametr příkazu reprezentuje typ experimentu, aby bylo dále možné
  // rozlišit, jaké parametry se budou nastavovat
  bytes.push(experiment.type);
  // Další parametry budou záviset na konkrétním experimentu
  switch (experiment.type) {
    case ExperimentType.ERP:
      bytes = bytes.concat(serializer.serializeExperimentERP(experiment as ExperimentERP));
      break;
    case ExperimentType.CVEP:
      bytes = bytes.concat(serializer.serializeExperimentCVEP(experiment as ExperimentCVEP));
      break;
    case ExperimentType.FVEP:
      bytes = bytes.concat(serializer.serializeExperimentFVEP(experiment as ExperimentFVEP));
      break;
    case ExperimentType.TVEP:
      bytes = bytes.concat(serializer.serializeExperimentTVEP(experiment as ExperimentTVEP));
      break;
  }

  // Nakonec přidám oddělovací znak
  bytes.push(commands.COMMAND_DELIMITER);
  return Buffer.from(Uint8Array.from(bytes));
}

