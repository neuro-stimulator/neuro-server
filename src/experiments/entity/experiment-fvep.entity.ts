import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentFvepEntity {

  @PrimaryColumn()
  @OneToOne(experiment => ExperimentEntity)
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;




}
