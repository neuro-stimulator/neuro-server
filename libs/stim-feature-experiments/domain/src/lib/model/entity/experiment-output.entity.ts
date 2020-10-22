import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ExperimentOutputEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  orderId: number;

  @Column({ type: 'integer' })
  type: number;

  @Column({ type: 'text', nullable: true })
  audioFile: string;

  @Column({ type: 'text', nullable: true })
  imageFile: string;

  // Podpora pro LED výstup
  @Column({ type: 'integer' })
  brightness: number;

  // Podpora pro obrázkový výstup
  @Column({ type: 'integer', nullable: true })
  x: number;
  @Column({ type: 'integer', nullable: true })
  y: number;
  @Column({ type: 'integer', nullable: true })
  width: number;
  @Column({ type: 'integer', nullable: true })
  height: number;
  @Column({ type: 'boolean', nullable: true })
  manualAlignment: boolean;
  @Column({ type: 'text', nullable: true })
  horizontalAlignment: string;
  @Column({ type: 'text', nullable: true })
  verticalAlignment: string;
}
