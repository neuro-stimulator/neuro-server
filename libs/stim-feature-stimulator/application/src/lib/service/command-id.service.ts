import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandIdService {
  private _counter = 1;

  /**
   * Vrátí unikátní hodnotu počítadla příkazů
   */
  public get counter(): number {
    // Uložím si aktuální hodnotu
    const value = this._counter;

    // Zvýším hodnotu počítadla
    this._counter++;
    // Pokud hodnota přesáhne hodnotu 0xf
    if (this._counter > 0xf) {
      // Počítadlo se vyresetuje na hodnotu 1 a jede od začátku
      this._counter = 1;
    }

    return value;
  }
}
