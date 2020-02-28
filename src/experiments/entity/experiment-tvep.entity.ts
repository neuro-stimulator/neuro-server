import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentTvepEntity {

  @PrimaryColumn()
  @OneToOne(experiment => ExperimentEntity)
  id: number;

  @Column({ type: 'boolean'})
  sharePatternLength: boolean;

  @Column({ type: 'integer' })
  outputCount: number;

}
