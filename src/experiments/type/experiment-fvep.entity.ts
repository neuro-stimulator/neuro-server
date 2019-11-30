import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ExperimentEntity } from '../experiment.entity';

@Entity()
export class ExperimentFvepEntity {

  @PrimaryColumn()
  @OneToOne(experiment => ExperimentEntity)
  @JoinColumn()
  id: number;

  @Column({ type: 'integer' })
  outputCount: number;

  @Column({type: 'integer'})
  timeOn: number;

  @Column({type: 'integer'})
  timeOff: number;

  @Column({type: 'integer'})
  frequency: number;

  @Column({type: 'integer'})
  dutyCycle: number;

  @Column({type: 'integer'})
  brightness: number;


}
