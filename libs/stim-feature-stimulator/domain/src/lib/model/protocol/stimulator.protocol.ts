import { Injectable } from '@nestjs/common';

import { CommandToStimulator, Experiment, Output, Sequence } from '@stechy1/diplomka-share';

import { StimulatorActionType } from '../stimulator-action-type';

import { ExperimentProtocolCodec } from './experiment.protocol.codec';
import { SequenceProtocolCodec } from './sequence.protocol.codec';

@Injectable()
export class StimulatorProtocol {

  public static readonly MANAGE_EXPERIMENT_MAP: Record<Exclude<StimulatorActionType, 'upload'>, number> = {
    setup: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_SETUP,
    run: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_RUN,
    pause: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_PAUSE,
    finish: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_FINISH,
    clear: CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_CLEAR,
  };

  constructor(private readonly experimentProtocolFactory: ExperimentProtocolCodec,
              private readonly sequenceProtocolFactory: SequenceProtocolCodec) {
  }

  public bufferCommandDISPLAY_CLEAR(): Buffer {
    return Buffer.from(Uint8Array.from(
      [
        CommandToStimulator.COMMAND_DISPLAY,
        CommandToStimulator.COMMAND_DISPLAY_ACTION_CLEAR,
        CommandToStimulator.COMMAND_DELIMITER
      ]
    ));
  }

  public bufferCommandDISPLAY_PRINT(text: string): Buffer {
    return this._bufferCommandDISPLAY_PRINT(text, CommandToStimulator.COMMAND_DISPLAY_ACTION_PRINT);
  }

  public bufferCommandDISPLAY_PRINT_LINE(text: string): Buffer {
    return this._bufferCommandDISPLAY_PRINT(text, CommandToStimulator.COMMAND_DISPLAY_ACTION_PRINT_LINE);
  }

  public bufferCommandSTIMULATOR_STATE(commandID = 0): Buffer {
    return Buffer.from(Uint8Array.from(
      [
        commandID,
        CommandToStimulator.COMMAND_STIMULATOR_STATE,
        CommandToStimulator.COMMAND_DELIMITER
      ]
    ));
  }

  public bufferCommandMANAGE_EXPERIMENT(command: Exclude<StimulatorActionType, 'upload'>, commandID = 0): Buffer {
    return Buffer.from(Uint8Array.from(
      [
        commandID,
        CommandToStimulator.COMMAND_MANAGE_EXPERIMENT,
        StimulatorProtocol.MANAGE_EXPERIMENT_MAP[command],
        CommandToStimulator.COMMAND_DELIMITER
      ]
    ));
  }

  public bufferCommandEXPERIMENT_UPLOAD(experiment: Experiment<Output>, commandID = 0, sequenceSize?: number): Buffer {
    return this.experimentProtocolFactory.encodeExperiment(experiment, commandID, sequenceSize);
  }

  public bufferCommandNEXT_SEQUENCE_PART(sequence: Sequence, offset: number, index: number, commandID = 0): Buffer {
    return this.sequenceProtocolFactory.encodeSequence(sequence, offset, index, commandID);
  }

  // Backdoor do stimulatoru

  public bufferCommandBACKDOOR_1(index: number, brightness: number, commandID = 0): Buffer {
    return Buffer.from(Uint8Array.from(
      [
        commandID,
        CommandToStimulator.COMMAND_BACKDOR_1,
        index,
        brightness,
        CommandToStimulator.COMMAND_DELIMITER
      ]
    ));
  }

  public bufferMemory(memoryType: number): Buffer {
    return Buffer.from(Uint8Array.from(
      [
        CommandToStimulator.COMMAND_MEMORY,
        memoryType,
        CommandToStimulator.COMMAND_DELIMITER
      ]
    ));
  }

  /**
   * Pomocná funkce pro převod textového řetězce na pole bytů
   *
   * @param text Řetězec, který se má převést
   */
  protected stringToBytes(text: string): number[] {
    const bytes = [];
    const length = text.length;
    for (let i = 0; i < length; i++) {
      bytes.push(text.charCodeAt(i));
    }

    return bytes;
  }

  /**
   * Pomocná metoda pro vyplnění buffer commandu pro odeslání textu do displaye
   *
   * @param text Text který se má zobrazit na displayi
   * @param action Má se přepsat celý obsah displaye, nebo jen přidat nová řádka
   */
  protected _bufferCommandDISPLAY_PRINT(text: string, action: number): Buffer {
    const bytes = [CommandToStimulator.COMMAND_DISPLAY, action];

    const textBytes = this.stringToBytes(text.toLowerCase());
    bytes.push(...textBytes);

    bytes.push(CommandToStimulator.COMMAND_DELIMITER);
    return Buffer.from(Uint8Array.from(bytes));
  }

}
