import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  exchangeRate: number;

  @Column()
  expireTime: Date;

  @Column()
  targetAmount: number;
}
