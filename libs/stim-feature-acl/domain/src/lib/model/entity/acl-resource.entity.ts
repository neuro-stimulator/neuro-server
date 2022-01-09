import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AclResourceEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', length: 64 })
  resource: string;

}
