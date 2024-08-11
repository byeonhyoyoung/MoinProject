import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransferHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  sourceAmount: number;

  @Column()
  fee: number;

  @Column()
  usdExchangeRate: number;

  @Column()
  usdAmount: number;

  @Column()
  targetCurrency: string;

  @Column()
  exchangeRate: number;

  @Column()
  targetAmount: number;

  @Column()
  requestedDate: Date;
}
