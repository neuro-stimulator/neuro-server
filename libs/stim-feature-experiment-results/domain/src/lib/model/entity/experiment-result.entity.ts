import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// import { ExperimentEntity } from '@diplomka-backend/stim-feature-experiments';

@Entity()
export class ExperimentResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne((experiment) => ExperimentEntity)
  // @JoinColumn({
  //   name: 'experimentID',
  //   referencedColumnName: 'id',
  // })
  @Column()
  experimentID: number;

  @Column({ length: 255, type: 'text', nullable: true })
  name: string;

  @Column({ length: 255, type: 'text' })
  type: string;

  @Column({ type: 'integer' })
  outputCount: number;

  @Column({ type: 'integer' })
  date: number;

  @Column({ type: 'text' })
  filename: string;
}
