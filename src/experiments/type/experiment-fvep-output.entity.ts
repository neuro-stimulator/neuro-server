import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExperimentTvepEntity } from './experiment-tvep.entity';

@Entity()
export class ExperimentFvepOutputEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(experiment => ExperimentTvepEntity)
  @JoinColumn()
  @Column()
  experimentId: number;

  @Column({ type: 'integer' })
  orderId: number;

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
