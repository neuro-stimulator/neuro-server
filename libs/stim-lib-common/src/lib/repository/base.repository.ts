import { SelectQueryBuilder } from 'typeorm';

import { FindOptions } from './find-options';

export abstract class BaseRepository {

  protected addFindOptions<E>(query: SelectQueryBuilder<E>, findOptions: FindOptions, alias: string): void {
    for (const key of Object.keys(findOptions)) {
      if (findOptions[key] !== undefined) {
        const param = {};
        param[key] = findOptions[key];
        query.andWhere(`${alias}.${key} = :${key}`, param);
      }
    }
  }

}
