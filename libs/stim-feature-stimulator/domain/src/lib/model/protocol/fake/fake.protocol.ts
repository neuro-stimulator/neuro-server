import { Injectable } from '@nestjs/common';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

@Injectable()
export class FakeProtocol {

  /**
   * Fake příkaz reprezentující odpověď ze stimulátoru se stavem Stimulátoru
   *
   * @param commandID ID příkazu
   * @param state Stav stimulátoru
   * @param noUpdate Zda-li se má aktualizovat GUI
   */
  public bufferCommandSTIMULATOR_STATE(commandID: number, state: number, noUpdate = 0): Buffer {
    const buffer = Buffer.alloc(11);
    let offset = 0;
    buffer.writeUInt8(commandID, offset++);
    buffer.writeUInt8(CommandFromStimulator.COMMAND_STIMULATOR_STATE, offset++);
    buffer.writeUInt8(8, offset++);
    buffer.writeUInt8(state, offset++);
    buffer.writeUInt8(noUpdate, offset++);
    const now = +`${Date.now()}`.substr(4);
    buffer.writeUInt32LE(now, offset);
    offset += 4;
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[0], offset++);
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[1], offset);

    return buffer;
  }

  /**
   * Fake příkaz reprezentující změnu IO na stimulátoru
   *
   * @param outputState Stav výstupu {@link CommandFromStimulator}
   *                    <p>
   *                    CommandFromStimulator.COMMAND_OUTPUT_ACTIVATED = 16
   *                    <p>
   *                    CommandFromStimulator.COMMAND_OUTPUT_DEACTIVATED = 17
   * @param outputIndex Index změněného výstupu
   */
  public bufferCommandSEND_IO(outputState: number, outputIndex = 0): Buffer {
    const buffer = Buffer.alloc(10);
    let offset = 0;
    buffer.writeUInt8(0, offset++); // ID zprávy (0 = výchozí)
    buffer.writeUInt8(outputState, offset++);
    buffer.writeUInt8(7, offset++);
    buffer.writeUInt8(outputIndex, offset++);
    const now = +`${Date.now()}`.substr(4);
    buffer.writeUInt32LE(now, offset);
    offset += 4;
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[0], offset++);
    buffer.writeUInt8(CommandFromStimulator.COMMAND_DELIMITER[1], offset);

    return buffer;
  }

}
