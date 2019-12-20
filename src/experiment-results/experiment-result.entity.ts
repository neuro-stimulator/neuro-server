import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ExperimentEntity } from '../experiments/experiment.entity';

@Entity()
export class ExperimentResultEntity {

  @PrimaryColumn()
  id: number;

  @PrimaryColumn()
  @OneToOne(experiment => ExperimentEntity)
  @JoinColumn()
  experimentID: number;

  @Column({ length: 255, type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  filename: string;
}
