import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExperimentEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255, type: 'text', nullable: false, unique: true})
  name: string;

  @Column({length: 255, type: 'text', nullable: true})
  description: string;

  @Column({length: 255, type: 'text'})
  type: string;

  @Column({type: 'integer'})
  created: number;

  @Column({type: 'boolean'})
  led: boolean;

  @Column({type: 'boolean'})
  image: boolean;

  @Column({type: 'boolean'})
  sound: boolean;

}
