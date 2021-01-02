import { EntityManager, EntityMetadata } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { Injectable } from '@nestjs/common';

import { DatabaseDump } from '@diplomka-backend/stim-feature-seed/domain';

@Injectable()
export class DatabaseDumpService {
  constructor(private readonly _manager: EntityManager) {}

  public async dumpDatabase(): Promise<DatabaseDump> {
    const entities: EntityMetadata[] = this._manager.connection.entityMetadatas;
    const dump: DatabaseDump = {};

    for (const entity of entities) {
      const repository = this._manager.getRepository(entity.target);
      dump[entity.name] = (await repository.find()).map((entry: unknown) => {
        delete entry['id'];
        return classToPlain(entry);
      });
    }

    return dump;
  }
}
