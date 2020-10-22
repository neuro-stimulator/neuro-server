import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ExperimentFvepEntity } from './experiment-fvep.entity';
import { ExperimentOutputEntity } from './experiment-output.entity';

@Entity()
export class ExperimentFvepOutputEntity extends ExperimentOutputEntity {
  @ManyToOne((experiment) => ExperimentFvepEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;

  @Column({ type: 'integer' })
  timeOn: number;

  @Column({ type: 'integer' })
  timeOff: number;

  @Column({ type: 'integer' })
  frequency: number;

  @Column({ type: 'integer' })
  dutyCycle: number;
}
