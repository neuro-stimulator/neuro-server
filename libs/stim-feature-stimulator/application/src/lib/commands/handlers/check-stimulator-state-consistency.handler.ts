import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CheckStimulatorStateConsistencyCommand } from '../impl/check-stimulator-state-consistency.command';
import { ExperimentClearCommand } from '../impl/experiment-clear.command';
import { StimulatorService } from '../../service/stimulator.service';

@CommandHandler(CheckStimulatorStateConsistencyCommand)
export class CheckStimulatorStateConsistencyHandler implements ICommandHandler<CheckStimulatorStateConsistencyCommand, void> {
  private readonly logger: Logger = new Logger(CheckStimulatorStateConsistencyHandler.name);

  constructor(private readonly service: StimulatorService, private readonly commandBus: CommandBus) {}

  async execute(command: CheckStimulatorStateConsistencyCommand): Promise<void> {
    if (this.service.lastKnownStimulatorState !== command.state) {
      this.logger.error('Byla zjištěna nekonzistence mezi reálným stavem stimulátoru a serverem!');
      this.logger.error(`Stav stimulátoru: ${command.state}, stav serveru: ${this.service.lastKnownStimulatorState}`);
      await this.commandBus.execute(new ExperimentClearCommand(true));
    }
  }
}
