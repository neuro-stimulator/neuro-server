import { Logger } from '@nestjs/common';
import { ICommandHandler, IEvent, EventBus } from '@nestjs/cqrs';

import { Subscription } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';

import { Settings, SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { StimulatorData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { CommandIdService } from '../../../service/command-id.service';
import { StimulatorEvent } from '../../../events/impl/stimulator.event';
import { BaseStimulatorBlockingCommand } from '../../impl/base/base-stimulator-blocking.command';

export abstract class BaseStimulatorBlockingHandler<TCommand extends BaseStimulatorBlockingCommand = any> implements ICommandHandler<TCommand, StimulatorData> {
  protected constructor(
    private readonly settings: SettingsFacade,
    protected readonly eventBus: EventBus,
    private readonly commandIdService: CommandIdService,
    protected readonly logger: Logger
  ) {}

  /**
   * Inicializace handleru
   */
  protected abstract init(): void;

  /**
   * Samotné zavolání požadované funkce
   *
   * @param command Command
   * @param commandID ID commandu
   */
  protected abstract async callServiceMethod(command: TCommand, commandID: number): Promise<void>;

  /**
   * V případě čekání na výsledek je tato funkce volána pro vyfiltrování zprávy ze stimulátoru
   *
   * @param event Stimulator Event
   */
  protected abstract isValid(event: StimulatorEvent): boolean;

  /**
   * V případě čekání na výsledek je tato funkce zavolána, když příjde odpověď ze stimulátoru
   *
   * @param event Stimulator Event
   */
  protected abstract done(event: StimulatorEvent): void;

  /**
   * V případě čekání na výsledek je tato funkce zavolána,
   * když odpověď ze stimulátoru nepříjde včas.
   *
   * @param error Chyba
   */
  protected error(error: any): void {
    this.logger.error(error);
  }

  async execute(command: TCommand): Promise<StimulatorData> {
    const settings: Settings = await this.settings.getSettings();
    const timeoutValue = settings.stimulatorResponseTimeout;

    this.init();

    return new Promise<StimulatorData>((resolve, reject) => {
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
            filter((event: StimulatorEvent) => this.isValid(event)),
            // Pomocí timeoutu se ujistím, že vždy dojde k nějaké reakci
            timeout(timeoutValue)
          )
          .subscribe(
            (event: StimulatorEvent) => {
              subscription.unsubscribe();
              this.logger.debug('Dorazila odpověď ze stimulátoru. Nyní ji můžu odeslat klientovi.');
              this.done(event);
              resolve(event.data);
            },
            (error) => {
              subscription.unsubscribe();
              this.logger.error('Odpověď ze stimulátoru nedorazila!');
              this.error(error);
              reject(error);
            },
            () => {
              this.logger.verbose('Complete');
            }
          );
      }

      // Nyní můžu spustit metodu
      this.callServiceMethod(command, commandID)
        .then(() => {
          if (!command.waitForResponse) {
            // Vyřeším promise a končím
            resolve();
          }
        })
        // Pokud nastala nějaká chyba, zamítnu promise s chybou
        .catch((e) => {
          reject(e);
        });
    });
  }
}
