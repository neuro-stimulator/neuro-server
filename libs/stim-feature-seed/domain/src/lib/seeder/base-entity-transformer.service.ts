import { DeepPartial } from '@neuro-server/stim-lib-common';

import { DataContainers } from '../model/data-container';
import { EntityTransformerService } from '../model/entity-transformer-service';

export abstract class BaseEntityTransformerService<E = unknown, F = unknown> implements EntityTransformerService<E, F>{

  /**
   * Transformuje implementaci rozhraní {@link E} na rozhraní {@link F}
   *
   * @param fromType Implementace rozhraní {@link E}
   * @param dataContainers DataContainer aktuální seedovací relace
   */
  public abstract transform(fromType: E, dataContainers: DataContainers) : DeepPartial<F>;

}
