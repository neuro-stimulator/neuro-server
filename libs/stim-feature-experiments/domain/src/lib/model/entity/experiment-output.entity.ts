import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { HorizontalAlignment, VerticalAlignment } from '@stechy1/diplomka-share';

export abstract class ExperimentOutputEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  orderId: number;

  @Column({ type: 'integer' })
  type: number;

  @Column({ type: 'text', nullable: true })
  audioFile?: string;

  @Column({ type: 'text', nullable: true })
  imageFile?: string;

  // Podpora pro LED výstup
  @Column({ type: 'integer' })
  brightness: number;

  // Podpora pro obrázkový výstup
  @Column({ type: 'integer', default: 0 })
  x: number;
  @Column({ type: 'integer', default: 0 })
  y: number;
  @Column({ type: 'integer', nullable: true })
  width: number;
  @Column({ type: 'integer', nullable: true })
  height: number;
  @Column({ type: 'boolean', nullable: true })
  manualAlignment: boolean;
  @Column({ type: 'integer', nullable: false, default: HorizontalAlignment.CENTER })
  horizontalAlignment: number;
  @Column({ type: 'integer', nullable: false, default: VerticalAlignment.CENTER })
  verticalAlignment: number;
}
