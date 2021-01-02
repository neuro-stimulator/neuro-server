import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('trigger_control')
export class TriggerControlEntity {
  @PrimaryColumn({ type: 'varchar', length: 64, unique: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}
