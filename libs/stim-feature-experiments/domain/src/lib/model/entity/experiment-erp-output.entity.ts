import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ExperimentErpEntity } from './experiment-erp.entity';
import { ExperimentOutputEntity } from './experiment-output.entity';

@Entity()
export class ExperimentErpOutputEntity extends ExperimentOutputEntity {
  @ManyToOne((experiment) => ExperimentErpEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;

  @Column({ type: 'integer' })
  pulseUp: number;

  @Column({ type: 'integer' })
  pulseDown: number;

  @Column({ type: 'integer' })
  distribution: number;
}
