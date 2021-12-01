import { Column, Entity, Generated, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { Type } from '@nestjs/class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'string'})
  @Generated('uuid')
  uuid: string;

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

  @ManyToMany(() => GroupEntity, group => group.id, { cascade: true, onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'user_groups_entity',
  })
  @Type(() => GroupEntity)
  userGroups: GroupEntity[];

  @Column({ type: 'text', length: 255 })
  roles: string;
}
