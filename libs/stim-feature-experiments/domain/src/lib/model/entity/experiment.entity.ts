import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';

import { GroupEntity } from '@diplomka-backend/stim-feature-users/domain';

@Entity()
export class ExperimentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ length: 255, type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ length: 255, type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  type: number;

  @Column({ type: 'integer', default: 1 })
  usedOutputs: number;

  @Column({ type: 'integer' })
  created: number;

  @Column({ type: 'integer', default: 1 })
  outputCount: number;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'boolean' })
  supportSequences: boolean;

  @ManyToMany(() => GroupEntity, group => group.id, { cascade: true })
  @JoinTable({
    name: 'experiment_groups_entity',
  })
  @Type(() => GroupEntity)
  userGroups: GroupEntity[];
}
