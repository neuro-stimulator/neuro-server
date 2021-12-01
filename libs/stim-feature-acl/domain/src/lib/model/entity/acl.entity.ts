import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AclRoleEntity } from './acl-role.entity';
import { AclResourceEntity } from './acl-resource.entity';
import { AclActionEntity } from './acl-action.entity';
import { AclPossessionEntity } from './acl-possession.entity';
import { Type } from '@nestjs/class-transformer';

@Entity()
export class AclEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AclRoleEntity, role => role.id, { cascade: true, eager: true })
  @Type(() => AclRoleEntity)
  role: AclRoleEntity;

  @ManyToOne(() => AclResourceEntity, role => role.id, { cascade: true, eager: true })
  @Type(() => AclResourceEntity)
  resource: AclResourceEntity;

  @ManyToOne(() => AclActionEntity, action => action.id, { cascade: true, eager: true })
  @Type(() => AclActionEntity)
  action: AclActionEntity;

  @ManyToOne(() => AclPossessionEntity, possession => possession.id, { cascade: true, eager: true })
  @Type(() => AclPossessionEntity)
  possession: AclPossessionEntity;

  @Column({ type: 'text', length: '255' })
  attributes: string;
}
