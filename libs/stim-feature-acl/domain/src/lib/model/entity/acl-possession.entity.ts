import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AclPossessionEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', length: 8 })
  possession: string;

}
