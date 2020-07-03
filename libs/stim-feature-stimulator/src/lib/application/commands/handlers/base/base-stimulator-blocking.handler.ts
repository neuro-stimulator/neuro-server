import { Logger } from '@nestjs/common';
import { ICommandHandler, IEvent, EventBus } from '@nestjs/cqrs';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { StimulatorData } from '../../../../domain/model/stimulator-command-data/index';
import { CommandIdService } from '../../../../domain/service/command-id.service';
import { StimulatorEvent } from '../../../events/impl/stimulator.event';
import { BaseStimulatorBlockingCommand } from '../../impl/base/base-stimulator-blocking.command';

export abstract class BaseStimulatorBlockingHandler<TCommand extends BaseStimulatorBlockingCommand = any> implements ICommandHandler<TCommand, StimulatorData> {
  protected constructor(protected readonly eventBus: EventBus, private readonly commandIdService: CommandIdService, protected readonly logger: Logger) {}

  protected abstract init();

  protected abstract callServiceMethod(command: TCommand, commandID: number);

  protected abstract isValid(event: StimulatorEvent);

  protected done(event: StimulatorEvent) {}

  async execute(command: TCommand): Promise<StimulatorData> {
    this.init();

    return new Promise<StimulatorData>(async (resolve, reject) => {
      let commandID = 0;
      let subscription: Subscription;
      // Pokud je příkaz blokující a mám tedy počkat na odpověď ze stimulátoru
      if (command.waitForResponse) {
        this.logger.debug('Blokující příkaz, budu čekat na odpověď ze stimulátoru.');
        // Získám unikátní číslo zprávy
        commandID = this.commandIdService.counter;
        this.logger.debug(`Vygenerované ID blokujícího příkazu: '${commandID}'.`);
        // Přihlásím se k odběru událostí z eventBus
        subscription = this.eventBus
          .pipe(
            // Vyfiltruji pouze události jednoho typu
            filter((event: IEvent) => event instanceof StimulatorEvent),
            // Událost přemapuji na StimulatorEvent
            map((event: IEvent) => event as StimulatorEvent),
            // Event musí mít commandID = 0
            filter((event: StimulatorEvent) => event.commandID === commandID),
            // Zajímat mě budou pouze událostí, které vyhoví validačnímu filtru
            filter((event: StimulatorEvent) => this.isValid(event))
          )
          .subscribe((event: StimulatorEvent) => {
            subscription.unsubscribe();
            this.logger.debug('Dorazila odpověď ze stimulátoru. Nyní ji můžu odeslat klientovi.');
            this.done(event);
            resolve(event.data);
          });
      }

      // Nyní můžu spustit metodu
      try {
        await this.callServiceMethod(command, commandID);
        // Pokud NEMÁM čekat na výsledek
        if (!command.waitForResponse) {
          // Vyřeším promise a končím
          resolve();
        }
      } catch (e) {
        // Pokud nastala nějaká chyba
        // A dotaz byl blokující
        if (subscription) {
          // Odhlásím se z odběru novinek
          subscription.unsubscribe();
        }
        // Zamítnu promise s chybou
        reject(e);
      }
    });
  }
}
