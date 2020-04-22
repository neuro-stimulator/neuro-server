/**
 * Rozhraní s funkcí pro zpracování příchozích dat ze serveru.
 */
export interface FakeSerialDataHandler {

  /**
   * Zpracuje přijatá data ze serveru.
   *
   * @param buffer Binární data.
   */
  handle(buffer: Buffer): void;
}

/**
 * Rozhraní s funkcí pro odeslání dat na server.
 */
export interface FakeSerialDataEmitter {

  /**
   * Odešle zadaná data na server.
   *
   * @param buffer Binární data.
   */
  emit(buffer: Buffer): void;
}
