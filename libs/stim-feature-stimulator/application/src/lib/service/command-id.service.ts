import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandIdService {
  private _counter = this.firstValue;

  constructor(public readonly firstValue: number = 1, public readonly maxValue: number = 0xf) {}

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
