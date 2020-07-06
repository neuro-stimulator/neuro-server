import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentFvepEntity {
  @PrimaryColumn()
  @OneToOne((experiment) => ExperimentEntity)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;
}
