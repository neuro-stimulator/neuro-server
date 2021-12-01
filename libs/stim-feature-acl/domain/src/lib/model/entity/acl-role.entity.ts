import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AclRoleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', length: 64 })
  role: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;
}
