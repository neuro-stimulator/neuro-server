import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentFinishedEvent, ExperimentRunCommand, SendStimulatorStateChangeToClientCommand } from '@diplomka-backend/stim-feature-stimulator/application';
import { ExperimentResultInsertCommand, WriteExperimentResultToFileCommand } from '@diplomka-backend/stim-feature-experiment-results/application';

import { PrepareNextExperimentRoundCommand } from '../../commands/impl/prepare-next-experiment-round.command';
import { PlayerService } from '../../service/player.service';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { SendExperimentStateToClientCommand } from '../../commands/impl/to-client/send-experiment-state-to-client.command';

@EventsHandler(ExperimentFinishedEvent)
export class ExperimentFinishedHandler implements IEventHandler<ExperimentFinishedEvent> {
  private readonly logger: Logger = new Logger(ExperimentFinishedHandler.name);

  constructor(private readonly commandBus: CommandBus, private readonly service: PlayerService) {}

  async handle(event: ExperimentFinishedEvent): Promise<void> {
    this.logger.debug('Experiment byl úspěšně ukončen.');

    try {
      if (this.service.nextRoundAvailable) {
        await this.commandBus.execute(new PrepareNextExperimentRoundCommand());
        if (this.service.autoplay) {
          this.logger.debug('Automatické přehrávání experimentu je aktivní.');
          this.service.scheduleNextRound().then(async () => {
            this.logger.debug('Budu spouštět experiment');
            const state: StimulatorStateData = await this.commandBus.execute(new ExperimentRunCommand(this.service.activeExperimentResult.experimentID, true));
            await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(state.state));
          });
          await this.commandBus.execute(
            new SendExperimentStateToClientCommand(
              true,
              this.service.experimentResultData,
              this.service.experimentRepeat,
              this.service.betweenExperimentInterval,
              this.service.autoplay,
              this.service.isBreakTime
            )
          );
        } else {
          this.logger.debug('Automatické přehrávání experimentu je vypnuto. Je třeba spustit další kolo manuálně.');
        }
      } else {
        this.logger.debug('Nechám zapsat výsledek experimentu do souboru.');
        await this.commandBus.execute(new WriteExperimentResultToFileCommand(this.service.activeExperimentResult, this.service.experimentResultData));
        this.logger.debug('Nechám vložit záznam výsledku experimentu do databáze.');
        await this.commandBus.execute(new ExperimentResultInsertCommand(this.service.activeExperimentResult));
        this.logger.debug('Vymažu aktuální výsledek experiementu z paměti.');
        this.service.clearRunningExperimentResult();
        // Odešlu klientům informaci o novém výchozím stavu experimentu
        await this.commandBus.execute(new SendExperimentStateToClientCommand(false, [], 0, 0, false, false));
      }
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.message);
    }
  }
}
