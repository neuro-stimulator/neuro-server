import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', length: 255 })
  username: string;

  @Column({ type: 'text', length: 255 })
  email: string;

  @Column({ type: 'text', length: 255 })
  password: string;

  @Column({ type: 'integer', nullable: true })
  lastLoginDate: number;

  @Column({ type: 'integer' })
  createdAt?: number;

  @Column({ type: 'integer' })
  updatedAt?: number;
}
