import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ExperimentReaEntity } from './experiment-rea.entity';
import { ExperimentOutputEntity } from './experiment-output.entity';

@Entity()
export class ExperimentReaOutputEntity extends ExperimentOutputEntity {
  @ManyToOne((experiment) => ExperimentReaEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;
}
