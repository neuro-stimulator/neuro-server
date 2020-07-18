import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'text' })
  clientId: string;

  @Column({ type: 'integer' })
  expiresAt: number;

  @Column({ type: 'text' })
  ipAddress: string;
}
