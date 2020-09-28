import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ExperimentStopConditionEntity {
  @PrimaryColumn()
  experimentType: string;

  @PrimaryColumn()
  experimentStopConditionType: string;
}
