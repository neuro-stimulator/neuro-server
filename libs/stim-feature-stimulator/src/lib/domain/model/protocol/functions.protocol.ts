import {
  CommandToStimulator,
  Experiment,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP,
  ExperimentType,
  Sequence,
} from '@stechy1/diplomka-share';

import * as serializer from './experiments.protocol';
import {
  SerializedExperiment,
  SerializedSequence,
} from './experiments.protocol';

/**
 * Pomocná funkce pro převod textového řetězce na pole bytů
 *
 * @param text Řetězec, který se má převést
 */
function stringToBytes(text: string): number[] {
  const bytes = [];
  const length = text.length;
  for (let i = 0; i < length; i++) {
    bytes.push(text.charCodeAt(i));
  }

  return bytes;
}

export function bufferCommandDISPLAY_CLEAR(): Buffer {
  return Buffer.from(
    Uint8Array.from([
      CommandToStimulator.COMMAND_DISPLAY,
      CommandToStimulator.COMMAND_DISPLAY_ACTION_CLEAR,
      CommandToStimulator.COMMAND_DELIMITER,
    ])
  );
}

export function bufferCommandDISPLAY_SET(
  x: number,
  y: number,
  text: string
): Buffer {
  const bytes = [
    CommandToStimulator.COMMAND_DISPLAY,
    CommandToStimulator.COMMAND_DISPLAY_ACTION_SET,
    x,
    y,
  ];

  const textBytes = stringToBytes(text);
  bytes.concat(textBytes);

  bytes.push(CommandToStimulator.COMMAND_DELIMITER);
  return Buffer.from(Uint8Array.from(bytes));
}

export function bufferCommandSTIMULATOR_STATE(): Buffer {
  return Buffer.from(
    Uint8Array.from([
      CommandToStimulator.COMMAND_STIMULATOR_STATE,
      CommandToStimulator.COMMAND_DELIMITER,
    ])
  );
}

export const MANAGE_EXPERIMENT_MAP = {
  setup: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_SETUP,
  run: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_RUN,
  pause: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_PAUSE,
  finish: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_FINISH,
  clear: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_CLEAR,
};

export function bufferCommandMANAGE_EXPERIMENT(
  command: 'setup' | 'run' | 'pause' | 'finish' | 'clear'
): Buffer {
  return Buffer.from(
    Uint8Array.from([
      CommandToStimulator.COMMAND_MANAGE_EXPERIMENT,
      MANAGE_EXPERIMENT_MAP[command],
      CommandToStimulator.COMMAND_DELIMITER,
    ])
  );
}

export function bufferCommandEXPERIMENT_UPLOAD(
  experiment: Experiment,
  sequence?: Sequence
): Buffer {
  const serializedExperiment: SerializedExperiment = {
    offset: 0,
    experiment: Buffer.alloc(256, 0),
    outputs: [],
  };
  serializedExperiment.experiment.writeUInt8(
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT,
    serializedExperiment.offset++
  );
  serializedExperiment.experiment.writeUInt8(
    CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD,
    serializedExperiment.offset++
  );
  // 1. parametr příkazu reprezentuje typ experimentu, aby bylo dále možné
  // rozlišit, jaké parametry se budou nastavovat
  serializedExperiment.experiment.writeUInt8(
    experiment.type,
    serializedExperiment.offset++
  );
  // Další parametry budou záviset na konkrétním experimentu
  switch (experiment.type) {
    case ExperimentType.ERP:
      serializer.serializeExperimentERP(
        experiment as ExperimentERP,
        sequence,
        serializedExperiment
      );
      break;
    case ExperimentType.CVEP:
      serializer.serializeExperimentCVEP(
        experiment as ExperimentCVEP,
        serializedExperiment
      );
      break;
    case ExperimentType.FVEP:
      serializer.serializeExperimentFVEP(
        experiment as ExperimentFVEP,
        serializedExperiment
      );
      break;
    case ExperimentType.TVEP:
      serializer.serializeExperimentTVEP(
        experiment as ExperimentTVEP,
        serializedExperiment
      );
      break;
    case ExperimentType.REA:
      serializer.serializeExperimentREA(
        experiment as ExperimentREA,
        serializedExperiment
      );
  }

  // Nakonec přidám oddělovací znak
  serializedExperiment.experiment.writeUInt8(
    CommandToStimulator.COMMAND_DELIMITER,
    serializedExperiment.offset++
  );

  // Založím výslednou proměnou se serializovaným experimentem
  const output = serializedExperiment.experiment;
  // Pokud experiment obsahuje nastavení výstupů
  if (serializedExperiment.outputs.length > 0) {
    for (const serializedOutput of serializedExperiment.outputs) {
      serializedOutput.output.copy(
        output,
        serializedExperiment.offset,
        0,
        serializedOutput.offset
      );
      serializedExperiment.offset += serializedOutput.offset;
    }
  }
  return output.slice(0, serializedExperiment.offset);
}

export function bufferCommandNEXT_SEQUENCE_PART(
  sequence: Sequence,
  offset: number,
  index: number
): Buffer {
  const seriaizedSequence: SerializedSequence = {
    offset: 0,
    sequence: Buffer.alloc(256, 0),
  };
  seriaizedSequence.sequence.writeUInt8(
    CommandToStimulator.COMMAND_SEQUENCE_NEXT_PART,
    seriaizedSequence.offset++
  );
  seriaizedSequence.sequence.writeUInt8(index, seriaizedSequence.offset++);

  serializer.serializeSequence(sequence, offset, seriaizedSequence);

  seriaizedSequence.sequence.writeUInt8(
    CommandToStimulator.COMMAND_DELIMITER,
    seriaizedSequence.offset++
  );

  return seriaizedSequence.sequence.slice(0, seriaizedSequence.offset);
}

// Backdoor do stimulatoru

export function bufferCommandBACKDOOR_1(
  index: number,
  brightness: number
): Buffer {
  return Buffer.from(
    Uint8Array.from([
      CommandToStimulator.COMMAND_BACKDOR_1,
      index,
      brightness,
      CommandToStimulator.COMMAND_DELIMITER,
    ])
  );
}

export function bufferMemory(memoryType: number): Buffer {
  return Buffer.from(
    Uint8Array.from([
      CommandToStimulator.COMMAND_MEMORY,
      memoryType,
      CommandToStimulator.COMMAND_DELIMITER,
    ])
  );
}
