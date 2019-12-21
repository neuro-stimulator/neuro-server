import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExperimentEntity } from '../experiments/experiment.entity';

@Entity()
export class ExperimentResultEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(experiment => ExperimentEntity)
  @JoinColumn()
  @Column()
  experimentID: number;

  @Column({ length: 255, type: 'text', nullable: true })
  name: string;

  @Column({ length: 255, type: 'text' })
  type: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  filename: string;
}
