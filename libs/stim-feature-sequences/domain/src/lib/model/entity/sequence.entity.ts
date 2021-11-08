import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';

import { GroupEntity } from '@neuro-server/stim-feature-users/domain';
// import { ExperimentEntity } from '@neuro-server/stim-feature-experiments';

@Entity()
export class SequenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  // @ManyToOne((experiment) => ExperimentEntity)
  // @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column({ type: 'integer', nullable: true })
  experimentId: number;

  @Column({ length: 255, type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  created: number;

  @Column({ type: 'text' })
  data: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({ type: 'text' })
  tags: string;

  @ManyToMany(() => GroupEntity, group => group.id, { cascade: true, onUpdate: 'NO ACTION' })
  @JoinTable({ name: 'sequence_groups_entity' })
  @Type(() => GroupEntity)
  userGroups: GroupEntity[];
}
