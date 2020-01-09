import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentErpEntity {

  @PrimaryColumn()
  @OneToOne(experiment => ExperimentEntity)
  @JoinColumn()
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;

  // @Column({ type: 'integer' })
  // maxDistributionValue: number;

  @Column({ type: 'integer' })
  out: number;

  @Column({ type: 'integer' })
  wait: number;

  @Column({ type: 'integer' })
  edge: number;

  @Column({ type: 'integer' })
  random: number;

}
