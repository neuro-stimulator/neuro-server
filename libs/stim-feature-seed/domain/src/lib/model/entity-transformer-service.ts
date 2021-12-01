import { DeepPartial } from '@neuro-server/stim-lib-common';

import { DataContainers } from './data-container';

export interface EntityTransformerService<E extends any = any, F extends any = any> {

  /**
   * Transformuje implementaci rozhraní {@link E} na rozhraní {@link F}
   *
   * @param fromType Implementace rozhraní {@link E}
   * @param dataContainers Datakontejner aktuální seedovací relace
   */
  transform(fromType: E, dataContainers: DataContainers): DeepPartial<F>;

}
