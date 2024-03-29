import { DeepPartial } from 'typeorm';

import { DataContainers } from './data-container';

export interface EntityTransformerService<E = unknown, F = unknown> {

  /**
   * Transformuje implementaci rozhraní {@link E} na rozhraní {@link F}
   *
   * @param fromType Implementace rozhraní {@link E}
   * @param dataContainers Datakontejner aktuální seedovací relace
   */
  transform(fromType: E, dataContainers: DataContainers): DeepPartial<F>;

}
