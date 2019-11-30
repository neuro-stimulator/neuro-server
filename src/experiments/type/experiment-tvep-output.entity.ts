import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ExperimentErpEntity } from './experiment-erp.entity';
import { ExperimentTvepEntity } from './experiment-tvep.entity';

@Entity()
export class ExperimentTvepOutputEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(experiment => ExperimentTvepEntity)
  @JoinColumn()
  @Column()
  experimentId: number;

  @Column({type: 'integer'})
  patternLength: number;

  @Column({type: 'integer'})
  pattern: number;

  @Column({type: 'integer'})
  out: number;

  @Column({type: 'integer'})
  wait: number;

  @Column({ type: 'integer' })
  brightness: number;
}
