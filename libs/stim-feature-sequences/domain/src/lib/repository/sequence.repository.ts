import { Injectable } from '@nestjs/common';
import { DeleteResult, EntityManager, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { Sequence } from '@stechy1/diplomka-share';

import { BaseRepository } from '@diplomka-backend/stim-lib-common';

import { SequenceEntity } from '../model/entity/sequence.entity';
import { entityToSequence, sequenceToEntity } from './sequences.mapping';
import { SequenceFindOptions } from './sequence.find-options';

@Injectable()
export class SequenceRepository extends BaseRepository{

  private static readonly ALIAS = 'sequence';

  private readonly _repository: Repository<SequenceEntity>;

  constructor(_manager: EntityManager) {
    super();
    this._repository = _manager.getRepository(SequenceEntity);
  }

    protected prepareFindQuery(findOptions: SequenceFindOptions): SelectQueryBuilder<SequenceEntity> {
    const query = this._repository
                      .createQueryBuilder(SequenceRepository.ALIAS)
                      .leftJoinAndSelect(`${SequenceRepository.ALIAS}.userGroups`, 'userGroup');

    if (findOptions.userGroups !== undefined) {
      query.where('userGroup.id IN (:...groups)', { groups: findOptions.userGroups });
    }

    if (findOptions.optionalOptions) {
      super.addFindOptions(query, findOptions.optionalOptions, SequenceRepository.ALIAS);
    }

    return query;
  }

  async all(findOptions: SequenceFindOptions): Promise<Sequence[]> {
    const query = this.prepareFindQuery(findOptions);

    const sequenceEntities: SequenceEntity[] = await query.getMany();

    return sequenceEntities.map((value: SequenceEntity) => entityToSequence(value));
  }
  async one(findOptions: SequenceFindOptions): Promise<Sequence | undefined> {
    const query = this.prepareFindQuery(findOptions);

    const sequenceEntity: SequenceEntity = await query.getOne();

    if (sequenceEntity === undefined) {
      return undefined;
    }

    return entityToSequence(sequenceEntity);
  }

  async insert(sequence: Sequence, userId: number): Promise<Sequence> {
    const entity: SequenceEntity = sequenceToEntity(sequence);
    entity.userId = userId;

    return entityToSequence(await this._repository.save(entity));
  }

  async update(sequence: Sequence): Promise<Sequence> {
    return entityToSequence(await this._repository.save(sequenceToEntity(sequence)));
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._repository.delete({ id });
  }

  async nameExists(name: string, id: number | 'new'): Promise<boolean> {
    let record;
    if (id === 'new') {
      record = await this._repository.findOne({ name });
    } else {
      record = await this._repository.findOne({ name, id: Not(id) });
    }

    return record !== undefined;
  }
}
