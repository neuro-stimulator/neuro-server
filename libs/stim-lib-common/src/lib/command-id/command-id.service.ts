import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommandIdService {
  private readonly logger: Logger = new Logger(CommandIdService.name);

  private _counter = this.firstValue;

  constructor(owner: string, public readonly firstValue: number = 1, public readonly maxValue: number = 0xf) {
    this.logger.verbose(`Vytvářím novou instanci pro: ${owner}.`);
  }

  /**
   * Vrátí unikátní hodnotu počítadla příkazů
   */
  public get counter(): number {
    // Uložím si aktuální hodnotu
    const value = this._counter;

    // Zvýším hodnotu počítadla
    this._counter++;
    // Pokud hodnota přesáhne hodnotu 0xf
    if (this._counter > this.maxValue) {
      // Počítadlo se vyresetuje na hodnotu 1 a jede od začátku
      this._counter = this.firstValue;
    }

    return value;
  }
}
