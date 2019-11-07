import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ExperimentErpOutputEntity } from './experiment-erp-output.entity';
import { ExperimentErpEntity } from './experiment-erp.entity';

@Entity()
export class ExperimentErpOutputDependencyEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(experiment => ExperimentErpEntity)
  @JoinColumn()
  experimentId: number;

  @ManyToOne(output => ExperimentErpOutputEntity)
  @JoinColumn()
  sourceOutput: number;

  @ManyToOne(output => ExperimentErpOutputEntity)
  @JoinColumn()
  destOutput: number;

  @Column({type: 'integer'})
  count: number;
}
