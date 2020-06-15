/**
 * Rozhraní definující funkce, kterými budou disponovat jednotlivé repozitáře
 *
 * @E Základní implementace experimentu
 * @T Konkrétní implementace experimentu
 */
import { ValidatorResult } from 'jsonschema';

export interface CustomExperimentRepository<E, T> {

  /**
   * Vrátí jeden konkrétní experiment
   *
   * @param record Základní experiment
   */
  one(record: E): Promise<T>;

  /**
   * Vloží konkrétní experiment do databáze
   *
   * @param record Konkrétní experiment
   */
  insert(record: T): Promise<any>;

  /**
   * Aktualizuje konkrétní experiment v databázi
   *
   * @param record Konkrétní experiment
   */
  update(record: T): Promise<any>;

  /**
   * Odstraní experiment z databáze
   *
   * @param id ID experimentu, který se má odstranit
   */
  delete(id: number): Promise<any>;

  /**
   * Zvalidauje objekt, zda-li vyhovuje schématu
   *
   * @param record Konkrétní experiment
   */
  validate(record: T): Promise<ValidatorResult>;

  /**
   * Získá informaci o použitých multimediálních výstupech
   *
   * @param record Konkrétní experiment
   */
  outputMultimedia(record: T): {audio: {}, image: {}};

}