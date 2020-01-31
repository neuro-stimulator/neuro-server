import { ExperimentType,
  Experiment, ExperimentERP, ExperimentCVEP, ExperimentFVEP, ExperimentTVEP,
  CommandToStimulator } from '@stechy1/diplomka-share';

import * as serializer from './experiments.protocol';
import { SerializedExperiment } from './experiments.protocol';
import { stringToBytes } from '../../share/byte.utils';

export function bufferCommandDISPLAY_CLEAR(): Buffer {
  return Buffer.from(Uint8Array.from([
    CommandToStimulator.COMMAND_DISPLAY,
    CommandToStimulator.COMMAND_DISPLAY_ACTION_CLEAR,
    CommandToStimulator.COMMAND_DELIMITER]));
}

export function bufferCommandDISPLAY_SET(x: number, y: number, text: string): Buffer {
  const bytes = [
    CommandToStimulator.COMMAND_DISPLAY,
    CommandToStimulator.COMMAND_DISPLAY_ACTION_SET, x, y];

  const textBytes = stringToBytes(text);
  bytes.concat(textBytes);

  bytes.push(CommandToStimulator.COMMAND_DELIMITER);
  return Buffer.from(Uint8Array.from(bytes));
}

export function bufferCommandMANAGE_EXPERIMENT(running: boolean): Buffer {
  return Buffer.from(Uint8Array.from([
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT,
    running ? CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_RUN : CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_STOP,
    CommandToStimulator.COMMAND_DELIMITER
  ]));
}

export function bufferCommandEXPERIMENT_UPLOAD(experiment: Experiment): Buffer {
  const serializedExperiment: SerializedExperiment = {offset: 0, experiment: Buffer.alloc(256, 0), outputs: []};
  serializedExperiment.experiment.writeUInt8(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT, serializedExperiment.offset++);
  serializedExperiment.experiment.writeUInt8(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD, serializedExperiment.offset++);
  // 1. parametr příkazu reprezentuje typ experimentu, aby bylo dále možné
  // rozlišit, jaké parametry se budou nastavovat
  serializedExperiment.experiment.writeUInt8(experiment.type, serializedExperiment.offset++);
  // Další parametry budou záviset na konkrétním experimentu
  switch (experiment.type) {
    case ExperimentType.ERP:
      serializer.serializeExperimentERP(experiment as ExperimentERP, serializedExperiment);
      break;
    case ExperimentType.CVEP:
      serializer.serializeExperimentCVEP(experiment as ExperimentCVEP, serializedExperiment);
      break;
    case ExperimentType.FVEP:
      serializer.serializeExperimentFVEP(experiment as ExperimentFVEP, serializedExperiment);
      break;
    case ExperimentType.TVEP:
      serializer.serializeExperimentTVEP(experiment as ExperimentTVEP, serializedExperiment);
      break;
  }

  // Nakonec přidám oddělovací znak
  serializedExperiment.experiment.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, serializedExperiment.offset++);

  // Založím výslednou proměnou se serializovaným experimentem
  const output = serializedExperiment.experiment;
  // Pokud experiment obsahuje nastavení výstupů
  if (serializedExperiment.outputs.length > 0) {
    for (const serializedOutput of serializedExperiment.outputs) {
      serializedOutput.output.copy(output, serializedExperiment.offset, 0, serializedOutput.offset);
      serializedExperiment.offset += serializedOutput.offset;
    }
  }
  return output.slice(0, serializedExperiment.offset);
}

export function bufferCommandEXPERIMENT_SETUP(): Buffer {
  return Buffer.from(Uint8Array.from([
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT,
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_SETUP,
    CommandToStimulator.COMMAND_DELIMITER
  ]));
}

export function bufferCommandCLEAR_EXPERIMENT(): Buffer {
  return Buffer.from(Uint8Array.from([
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT,
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_CLEAR,
    CommandToStimulator.COMMAND_DELIMITER
  ]));
}



// Backdoor do stimulatoru

export function bufferCommandBACKDOOR_1(index: number, brightness: number): Buffer {
  return Buffer.from(Uint8Array.from([
    CommandToStimulator.COMMAND_BACKDOR_1,
    index, brightness,
    CommandToStimulator.COMMAND_DELIMITER
  ]));

}

export function bufferDebug(): Buffer {
  return Buffer.from(Uint8Array.from([
    0xF1,
    CommandToStimulator.COMMAND_DELIMITER
  ]));
}
