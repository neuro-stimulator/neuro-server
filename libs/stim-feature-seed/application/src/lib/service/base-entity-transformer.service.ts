import { DeepPartial } from '@neuro-server/stim-lib-common';

import { DataContainers, EntityTransformerService } from '@neuro-server/stim-feature-seed/domain';

export abstract class BaseEntityTransformerService<E extends any = any, F extends any = any> implements EntityTransformerService<E, F>{

  /**
   * Transformuje implementaci rozhraní {@link E} na rozhraní {@link F}
   *
   * @param fromType Implementace rozhraní {@link E}
   * @param dataContainers DataContainer aktuální seedovací relace
   */
  public abstract transform(fromType: E, dataContainers: DataContainers) : DeepPartial<F>;

}
