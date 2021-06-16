import { Logger } from '@nestjs/common';
import { EventBus, ICommandHandler, IEvent } from '@nestjs/cqrs';

import { BaseBlockingCommand } from './base-blocking.command';
import { TimeoutError } from 'rxjs/internal/util/TimeoutError';
import { Subscription } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';
import { BaseBlockingEvent } from './base-blocking.event';
import { CommandIdService } from '../command-id/command-id.service';

export abstract class BaseBlockingHandler<TCommand extends BaseBlockingCommand<CType>, CType, EType extends BaseBlockingEvent<RType>, RType>
  implements ICommandHandler<TCommand, RType> {
  protected constructor(private readonly commandIdService: CommandIdService, protected readonly eventBus: EventBus, protected readonly logger: Logger) {}

  /**
   * Ověří, že je možné vykonat blokující příkaz v aktuálním kontextu.
   */
  protected async canExecute(): Promise<boolean | [boolean, string]> {
    return true;
  }

  /**
   * Inicializace handleru
   */
  protected abstract init(command: TCommand): Promise<void>;

  /**
   * Samotné zavolání požadované funkce
   *
   * @param command Command
   * @param commandID ID commandu
   */
  protected abstract callServiceMethod(command: TCommand, commandID: number): Promise<void>;

  /**
   * V případě čekání na výsledek je tato funkce volána pro vyfiltrování zprávy z přehrávače multimédií
   *
   * @param event Ipc Event
   */
  protected abstract isValid(event: EType): boolean;

  /**
   * V případě čekání na výsledek je tato funkce zavolána, když příjde odpověď z přehrávače multimédií
   *
   * @param event Stimulator Event
   * @param command Command
   */
  protected abstract done(event: EType, command: TCommand): void;

  protected abstract provideBlockingFailedEvent(commandType: CType): IEvent;

  protected abstract isRequestedEvent(event: IEvent): boolean;

  /**
   * V případě čekání na výsledek je tato funkce zavolána,
   * když odpověď z přehrávače multimédií nepříjde včas.
   *
   * @param error Chyba
   * @param command Příkaz, který se nepodařilo vykonat
   */
  protected onError(error: Error, command: TCommand): void {
    if (error instanceof TimeoutError) {
      this.onTimeout(command);
    } else {
      this.logger.error('Nastala neznámá chyba při vykonávání příkazu!');
    }

    this.eventBus.publish(this.provideBlockingFailedEvent(command.commandType));
  }

  /**
   * Zavolá se automaticky, když do požadovaného intervalu nepříjde odpověď z přehrávače multimédií
   *
   * @param command Příkaz, u kterého vypršel timeout
   */
  protected onTimeout(command: TCommand): void {
    this.logger.error('Vypršel timeout pro vykonání příkazu!');
  }

  async execute(command: TCommand): Promise<RType> {
    const canExecute = await this.canExecute();
    if (canExecute !== true) {
      const [_, reason] = canExecute as [boolean, string];
      this.logger.warn(`Blokující příkaz nelze vykonat: '${reason}'`);
      return Promise.resolve(null);
    }

    await this.init(command);

    return new Promise<RType>((resolve, reject) => {
      let commandID = 0;
      let subscription: Subscription;
      // Pokud je příkaz blokující a mám tedy počkat na odpověď
      if (command.waitForResponse) {
        this.logger.debug('Blokující příkaz, budu čekat na odpověď.');
        // Získám unikátní číslo zprávy
        commandID = this.commandIdService.counter;
        this.logger.debug(`Vygenerované ID blokujícího příkazu: '${commandID}'.`);
        // Přihlásím se k odběru událostí z eventBus
        subscription = this.eventBus
          .pipe(
            // Vyfiltruji pouze události jednoho typu
            filter((event: IEvent) => this.isRequestedEvent(event)),
            // Událost přemapuji na StimulatorEvent
            map((event: IEvent) => event as EType),
            // Event musí mít commandID = 0
            filter((event: EType) => event.commandID === commandID),
            // Zajímat mě budou pouze událostí, které vyhoví validačnímu filtru
            filter((event: EType) => this.isValid(event)),
            // Pomocí timeoutu se ujistím, že vždy dojde k nějaké reakci
            timeout(this.timeoutValue)
          )
          .subscribe(
            (event: EType) => {
              subscription.unsubscribe();
              this.logger.debug('Dorazila odpověď na blokující příkaz. Nyní ji můžu zpracovat.');
              this.done(event, command);
              resolve(event.data);
            },
            (error) => {
              subscription.unsubscribe();
              this.onError(error, command);
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
            resolve(undefined);
          }
        })
        // Pokud nastala nějaká chyba, zamítnu promise s chybou
        .catch((e) => {
          reject(e);
        });
    });
  }

  protected abstract get timeoutValue(): number;
}
