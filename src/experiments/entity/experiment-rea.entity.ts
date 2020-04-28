import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { ExperimentEntity } from './experiment.entity';

@Entity()
export class ExperimentReaEntity {

  @PrimaryColumn()
  @OneToOne((experiment) => ExperimentEntity)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;

  @Column({ type: 'text', nullable: true })
  audioFile: string;

  @Column({ type: 'text', nullable: true })
  imageFile: string;

  @Column({type: 'integer'})
  cycleCount: number;

  @Column({type: 'integer'})
  waitTimeMin: number;

  @Column({type: 'integer'})
  waitTimeMax: number;

  @Column({type: 'integer'})
  missTime: number;

  @Column({type: 'integer'})
  onFail: number;

  @Column({type: 'integer'})
  brightness: number;

}
