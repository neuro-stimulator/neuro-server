import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ExperimentOutputEntity } from './experiment-output.entity';
import { ExperimentReaEntity } from './experiment-rea.entity';

@Entity()
export class ExperimentReaOutputEntity extends ExperimentOutputEntity {
  @ManyToOne((experiment) => ExperimentReaEntity)
  @JoinColumn({ name: 'experimentId', referencedColumnName: 'id' })
  @Column()
  experimentId: number;
}
