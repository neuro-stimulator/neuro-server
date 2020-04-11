import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExperimentFvepEntity } from './experiment-fvep.entity';

@Entity()
export class ExperimentFvepOutputEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((experiment) => ExperimentFvepEntity)
  @JoinColumn()
  @Column()
  experimentId: number;

  @Column({ type: 'integer' })
  orderId: number;

  @Column({ type: 'integer' })
  type: number;

  @Column({ type: 'text', nullable: true })
  audioFile: string;

  @Column({ type: 'text', nullable: true })
  imageFile: string;

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
