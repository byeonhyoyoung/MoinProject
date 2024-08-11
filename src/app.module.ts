import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { TransferController } from './transfer/transfer.controller';
import { User } from './user/user.entity';
import { Quote } from './transfer/quote.entity';
import { TransferHistory } from './transfer/transfer-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', //또는 'postgres'
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'moin',
      entities: [User, Quote, TransferHistory],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Quote, TransferHistory]),
  ],
  controllers: [UserController, TransferController],
  providers: [],
})
export class AppModule {}
