import { Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceEntity } from '../entity/sequence.entity';
import { entityToSequence, sequenceToEntity } from '../sequences.mapping';

@Injectable()
export class SequenceRepository {

  private readonly repository: Repository<SequenceEntity>;

  constructor(_manager: EntityManager) {
    this.repository = _manager.getRepository(SequenceEntity);
  }

  async all(options?: FindManyOptions<SequenceEntity>): Promise<Sequence[]> {
    const sequenceEntities: SequenceEntity[] = await this.repository.find(options);

    return sequenceEntities.map(value => entityToSequence(value));
  }
  async one(id: number): Promise<Sequence> {
    const sequenceEntity: SequenceEntity = await this.repository.findOne(id);
    if (sequenceEntity === undefined) {
      return undefined;
    }

    return entityToSequence(sequenceEntity);
  }
  async insert(sequence: Sequence): Promise<any> {
    return this.repository.insert(sequenceToEntity(sequence));
  }
  async update(sequence: Sequence): Promise<any> {
    return this.repository.update({ id: sequence.id }, sequenceToEntity(sequence));
  }
  async delete(id: number): Promise<any> {
    return this.repository.delete({ id });
  }

}
