import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ExperimentEntity } from '../../../../../../libs/stim-feature-experiments/src/lib/domain/model/entity/experiment.entity';

@Entity()
export class ExperimentResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((experiment) => ExperimentEntity)
  @JoinColumn({
    name: 'experimentID',
    referencedColumnName: 'id',
  })
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
}