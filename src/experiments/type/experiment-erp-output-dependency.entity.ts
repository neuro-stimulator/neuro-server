import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ExperimentErpOutputEntity } from './experiment-erp-output.entity';
import { ExperimentErpEntity } from './experiment-erp.entity';

@Entity()
@Unique(['experimentId', 'sourceOutput', 'destOutput'])
export class ExperimentErpOutputDependencyEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(experiment => ExperimentErpEntity)
  @JoinColumn()
  @Column()
  experimentId: number;

  @ManyToOne(output => ExperimentErpOutputEntity)
  @JoinColumn()
  @Column()
  sourceOutput: number;

  @ManyToOne(output => ExperimentErpOutputEntity)
  @JoinColumn()
  @Column()
  destOutput: number;

  @Column({ type: 'integer' })
  count: number;
}
