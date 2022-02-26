import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ExperimentOutputEntity } from './experiment-output.entity';
import { ExperimentTvepEntity } from './experiment-tvep.entity';

@Entity()
export class ExperimentTvepOutputEntity extends ExperimentOutputEntity {
  @ManyToOne((experiment) => ExperimentTvepEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;

  @Column({ type: 'integer' })
  patternLength: number;

  @Column({ type: 'integer' })
  pattern: number;

  @Column({ type: 'integer' })
  out: number;

  @Column({ type: 'integer' })
  wait: number;
}
