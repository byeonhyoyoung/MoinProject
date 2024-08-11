import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  idType: string;

  @Column()
  idValue: string;
}
