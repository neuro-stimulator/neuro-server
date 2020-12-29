import { User } from '@stechy1/diplomka-share';

/**
 * Cesta, nebo pole cest k datakontejnerům pro konkrétní entitu
 */
export type EntityDataContainerRoot = string | string[];

/**
 * Typ pro entity a jejich cesty k datakontejnerům
 */
export type EntitiesDataContainerRoot = Record<string, EntityDataContainerRoot>;

/**
 * Cesta k datakontejnerům
 */
export type DataContainersRoot = string | EntitiesDataContainerRoot;

/**
 * Konfigurace pro E2E testování
 * - dataContainersRoot - {@link dataContainersRoot}
 * - useFakeAuthorization - {@link useFakeAuthorization}
 * - user - {@link user}
 */
export interface SetupConfiguration {
  /**
   * {@link DataContainersRoot}
   */
  dataContainersRoot?: DataContainersRoot;
  /**
   * Přepínač mezi reálnou a fake implementací autorizací
   */
  useFakeAuthorization?: boolean;
  /**
   * Uživatel, který se použije v případě fake implementace autorizace
   */
  user?: Partial<User>;
}
