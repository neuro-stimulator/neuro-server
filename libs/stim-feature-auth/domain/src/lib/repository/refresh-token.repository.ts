import { Injectable } from '@nestjs/common';
import { DeleteResult, EntityManager, FindConditions, InsertResult, Repository } from 'typeorm';

import { RefreshTokenEntity } from '../model/entity/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  private readonly _repository: Repository<RefreshTokenEntity>;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getRepository(RefreshTokenEntity);
  }

  async one(criteria: FindConditions<RefreshTokenEntity>): Promise<RefreshTokenEntity> {
    return this._repository.findOne(criteria);
  }

  async insert(token: RefreshTokenEntity): Promise<InsertResult> {
    return this._repository.insert(token);
  }

  async delete(criteria: FindConditions<RefreshTokenEntity>): Promise<DeleteResult> {
    return this._repository.delete(criteria);
  }
}
