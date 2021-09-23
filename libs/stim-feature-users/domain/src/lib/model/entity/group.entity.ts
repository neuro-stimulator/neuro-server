import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true, length: 128 })
  name?: string;
}
