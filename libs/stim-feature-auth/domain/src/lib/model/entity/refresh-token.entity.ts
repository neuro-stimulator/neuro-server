import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  uuid: string;

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

  @Column({ type: 'text' })
  userGroups: string
}
