import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ExperimentErpOutputEntity } from './experiment-erp-output.entity';
import { ExperimentErpEntity } from './experiment-erp.entity';

@Entity()
@Unique(['experimentId', 'sourceOutput', 'destOutput'])
export class ExperimentErpOutputDependencyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((experiment) => ExperimentErpEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column({ type: 'integer' })
  experimentId: number;

  @ManyToOne((output) => ExperimentErpOutputEntity)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  @Column({ type: 'integer' })
  sourceOutput: number;

  @ManyToOne((output) => ExperimentErpOutputEntity)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  @Column({ type: 'integer' })
  destOutput: number;

  @Column({ type: 'integer' })
  count: number;
}
