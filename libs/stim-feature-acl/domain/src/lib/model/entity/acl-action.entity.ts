import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AclActionEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', length: 64 })
  action: string;

}
