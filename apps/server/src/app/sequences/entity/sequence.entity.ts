import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExperimentEntity } from '../../../../../../libs/stim-feature-experiments/src/lib/domain/model/entity/experiment.entity';

@Entity()
export class SequenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((experiment) => ExperimentEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
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
}
