import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentCvepEntity {

  @PrimaryColumn()
  @OneToOne((experiment) => ExperimentEntity, (experiment: ExperimentEntity) => experiment.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;

  @Column({ type: 'text', nullable: true })
  audioFile: string;

  @Column({ type: 'text', nullable: true })
  imageFile: string;

  @Column({type: 'integer'})
  out: number;

  @Column({type: 'integer'})
  wait: number;

  @Column({type: 'integer'})
  pattern: number;

  @Column({type: 'integer'})
  bitShift: number;

  @Column({type: 'integer'})
  brightness: number;

}
