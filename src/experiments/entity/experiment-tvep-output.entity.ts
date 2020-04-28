import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ExperimentTvepEntity } from './experiment-tvep.entity';

@Entity()
export class ExperimentTvepOutputEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((experiment) => ExperimentTvepEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;

  @Column({ type: 'integer' })
  orderId: number;

  @Column({ type: 'integer'})
  type: number;

  @Column({ type: 'text', nullable: true })
  audioFile: string;

  @Column({ type: 'text', nullable: true })
  imageFile: string;

  @Column({type: 'integer'})
  patternLength: number;

  @Column({type: 'integer'})
  pattern: number;

  @Column({type: 'integer'})
  out: number;

  @Column({type: 'integer'})
  wait: number;

  @Column({ type: 'integer' })
  brightness: number;
}
