import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

// import { SequenceEntity } from '@neuro-server/stim-feature-sequences';

import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentErpEntity {
  @PrimaryColumn()
  @OneToOne((experiment) => ExperimentEntity, (experiment: ExperimentEntity) => experiment.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
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

  // @OneToMany(
  //   (sequence) => SequenceEntity,
  //   (sequence: SequenceEntity) => sequence.experimentId
  // )
  // @JoinColumn({ name: 'sequenceId', referencedColumnName: 'id' })
  @Column({ type: 'integer', nullable: true })
  sequenceId: number;

  @Column({ type: 'integer', nullable: false })
  defaultSequenceSize: number;
}
