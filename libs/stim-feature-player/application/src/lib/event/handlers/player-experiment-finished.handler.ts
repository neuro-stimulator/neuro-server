import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  ExperimentClearCommand,
  ExperimentFinishedEvent,
  ExperimentRunCommand,
  SendStimulatorStateChangeToClientCommand,
} from '@diplomka-backend/stim-feature-stimulator/application';
import { ExperimentResultInsertCommand, WriteExperimentResultToFileCommand } from '@diplomka-backend/stim-feature-experiment-results/application';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { PrepareNextExperimentRoundCommand } from '../../commands/impl/prepare-next-experiment-round.command';
import { PlayerService } from '../../service/player.service';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';

@EventsHandler(ExperimentFinishedEvent)
export class PlayerExperimentFinishedHandler implements IEventHandler<ExperimentFinishedEvent> {
  private readonly logger: Logger = new Logger(PlayerExperimentFinishedHandler.name);

  constructor(private readonly commandBus: CommandBus, private readonly service: PlayerService) {}

  async handle(event: ExperimentFinishedEvent): Promise<void> {
    this.logger.debug('Experiment byl úspěšně ukončen.');

    try {
      if (this.service.nextRoundAvailable) {
        // Pokud je dostupné další kolo experimentu
        // Nechám toto kolo iniciaizovat
        await this.commandBus.execute(new PrepareNextExperimentRoundCommand(this.service.userID));
        if (this.service.autoplay) {
          // Pokud je zapnuté automatické přehrávání
          this.logger.debug('Automatické přehrávání experimentu je aktivní.');
          // Naplánuje spuštění dalšího kola
          this.service.scheduleNextRound().then(async () => {
            // Další kolo se spustí po vytikání časovače
            this.logger.debug('Budu spouštět experiment');
            const state: StimulatorStateData = await this.commandBus.execute(new ExperimentRunCommand(this.service.activeExperimentResult.experimentID, true));
            // Nakonec se odešle klientovi aktualizace stavu stimulátoru
            this.logger.debug('Budu odesílat stav stimulátoru klientovi.');
            await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(state.state));
          });
          // Odešlu stav přehrávače klientovi
          await this.commandBus.execute(new SendPlayerStateToClientCommand(this.service.playerConfiguration));
        } else {
          // Automatické přehrávání je vypnuto
          this.logger.debug('Automatické přehrávání experimentu je vypnuto. Je třeba spustit další kolo manuálně.');
        }
      } else {
        // Další kolo experimentu není dostupné
        // Ukončovací fáze celého experimentu, uložení výsledku experimentu do databáze, data do souboru, vymazání paměti stimulátoru
        this.logger.debug('Nechám zapsat výsledek experimentu do souboru.');
        await this.commandBus.execute(new WriteExperimentResultToFileCommand(this.service.activeExperimentResult, this.service.experimentResultData));
        this.logger.debug('Nechám vložit záznam výsledku experimentu do databáze.');
        await this.commandBus.execute(new ExperimentResultInsertCommand(this.service.activeExperimentResult, this.service.userID));
        this.logger.debug('Vymažu aktuální experiment ze stimulátoru.');
        const state: StimulatorStateData = await this.commandBus.execute(new ExperimentClearCommand(true));
        this.logger.debug('Budu odesílat stav stimulátoru klientovi.');
        await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(state.state));
        this.logger.debug('Budu odesílat stav přehrávače experimentů klientovi.');
        await this.commandBus.execute(new SendPlayerStateToClientCommand(this.service.playerConfiguration));
      }
    } catch (e) {
      this.logger.error(e);
      this.logger.error(e.message);
    }
  }
}
