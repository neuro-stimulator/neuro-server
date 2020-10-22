import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ExperimentCvepEntity } from './experiment-cvep.entity';
import { ExperimentOutputEntity } from './experiment-output.entity';

@Entity()
export class ExperimentCvepOutputEntity extends ExperimentOutputEntity {
  @ManyToOne((experiment) => ExperimentCvepEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;
}
