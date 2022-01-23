import { EntityStatistic, FailedEntityStatistics, SeedStatistics, SuccessfulEntityStatistics } from '../model/seed-statistics';

export class EntityStatisticsSerializer {

  /**
   * Serializuje a minimalizuje seed statistiky
   *
   * @param seedStatistics {@link SeedStatistics}
   */
  public serialize(seedStatistics: SeedStatistics): string {
    let output = '';

    for (const entity in seedStatistics) {
      const entityStatistics: EntityStatistic = seedStatistics[entity];
      let includeStatistics = false;
      let statisticsBuffer = '';

      if (this.hasSuccessfullRecords(entityStatistics)) {
        includeStatistics = true;
        statisticsBuffer += 'successful=[';
        statisticsBuffer += `inserted=${entityStatistics.successful.inserted},`;
        statisticsBuffer += `updated=${entityStatistics.successful.updated},`;
        statisticsBuffer += `deleted=${entityStatistics.successful.deleted}`;
        statisticsBuffer += ']';
      }

      if (this.hasFailedfullRecords(entityStatistics)) {
        includeStatistics = true;
        output += this.buildFailedStatistics(entityStatistics.failed, 'inserted');
        output += this.buildFailedStatistics(entityStatistics.failed, 'updated');
        output += this.buildFailedStatistics(entityStatistics.failed, 'deleted', false);
      }

      if (includeStatistics) {
        output += `${entity}{`
        output += statisticsBuffer;
        output += '}';
      }
    }

    return output;
  }

  protected hasSuccessfullRecords(entityStatistics: EntityStatistic): boolean {
    return this.hasRecords(entityStatistics, 'successful');
  }

  protected hasFailedfullRecords(entityStatistics: EntityStatistic): boolean {
    return this.hasRecords(entityStatistics, 'failed');
  }

  protected hasRecords(entityStatistics: EntityStatistic, type: 'successful' | 'failed'): boolean {
    if (type === 'successful') {
      return this.sumSuccessfulStatistics(entityStatistics.successful) !== 0;
    }

    return this.sumFailedStatistics(entityStatistics.failed) !== 0;
  }

  protected sumSuccessfulStatistics(statistics: SuccessfulEntityStatistics): number {
    return statistics.inserted + statistics.updated + statistics.deleted;
  }

  protected sumFailedStatistics(statistics: FailedEntityStatistics): number {
    return statistics.inserted.count + statistics.updated.count + statistics.deleted.count;
  }

  protected buildFailedStatistics(failedStatistics: FailedEntityStatistics, type: 'inserted' | 'updated' | 'deleted', includeComa = true): string {
    const statistics = failedStatistics[type];
    let buffer = `${type}=${statistics.count}`;


    if (statistics.count === 0) {
      if (includeComa) {
        buffer += ',';
      }
      return buffer;
    }

    for (const reason of statistics.reason) {
      buffer += `\t${reason}`;
    }

    buffer += '\n';

    return buffer;
  }
}
