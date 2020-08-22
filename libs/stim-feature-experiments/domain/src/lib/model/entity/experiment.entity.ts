import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExperimentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, type: 'text', nullable: false, unique: true })
  name: string;

  @Column({ length: 255, type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, type: 'text' })
  type: string;

  @Column({ type: 'integer', default: 1 })
  usedOutputs: number;

  @Column({ type: 'integer' })
  created: number;

  @Column({ type: 'integer', default: 1 })
  outputCount: number;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'boolean' })
  supportSequences: boolean;
}
