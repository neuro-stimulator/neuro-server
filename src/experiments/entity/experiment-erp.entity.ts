import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { SequenceEntity } from '../../sequences/entity/sequence.entity';

@Entity()
export class ExperimentErpEntity {

  @PrimaryColumn()
  @OneToOne((experiment) => ExperimentEntity, (experiment: ExperimentEntity) => experiment.id)
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;

  @Column({ type: 'integer' })
  maxDistribution: number;

  @Column({ type: 'integer' })
  out: number;

  @Column({ type: 'integer' })
  wait: number;

  @Column({ type: 'integer' })
  edge: number;

  @Column({ type: 'integer' })
  random: number;

  @OneToMany((sequence) => SequenceEntity, (sequence: SequenceEntity) => sequence.experimentId)
  @Column({ type: 'integer', nullable: true})
  sequenceId: number;

}
