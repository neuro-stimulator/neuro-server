import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ExperimentEntity } from '../experiment.entity';

@Entity()
export class ExperimentTvepEntity {

  @PrimaryColumn()
  @OneToOne(experiment => ExperimentEntity)
  @JoinColumn()
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;

}
