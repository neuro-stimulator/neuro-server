import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from '@nestjs/class-transformer';

import { GroupEntity } from '@neuro-server/stim-feature-users/domain';

// import { ExperimentEntity } from '@neuro-server/stim-feature-experiments';

@Entity()
export class ExperimentResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  // @ManyToOne((experiment) => ExperimentEntity)
  // @JoinColumn({
  //   name: 'experimentID',
  //   referencedColumnName: 'id',
  // })
  @Column()
  experimentID: number;

  @Column({ length: 255, type: 'text', nullable: true })
  name: string;

  @Column({ length: 255, type: 'text' })
  type: string;

  @Column({ type: 'integer' })
  outputCount: number;

  @Column({ type: 'integer' })
  date: number;

  @Column({ type: 'text' })
  filename: string;

  @ManyToMany(() => GroupEntity, group => group.id, { cascade: true })
  @JoinTable({
    name: 'experiment_result_groups_entity',
  })
  @Type(() => GroupEntity)
  userGroups: GroupEntity[];
}
