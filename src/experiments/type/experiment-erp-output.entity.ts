import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExperimentErpEntity } from './experiment-erp.entity';

@Entity()
export class ExperimentErpOutputEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(experiment => ExperimentErpEntity)
  @JoinColumn()
  experimentId: number;

  @Column({ type: 'integer' })
  orderId: number;

  @Column({ type: 'integer' })
  pulseUp: number;

  @Column({ type: 'integer' })
  pulseDown: number;

  @Column({ type: 'integer' })
  distribution: number;

  @Column({ type: 'integer' })
  brightness: number;
}