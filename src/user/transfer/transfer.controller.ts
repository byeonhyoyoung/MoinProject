import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './quote.entity'; //견적 엔터티
import { User } from './user.entity';  //유저 엔터티
import { TransferHistory } from './transfer-history.entity';

@Controller('transfer')
export class TransferController {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TransferHistory)
    private readonly transferHistoryRepository: Repository<TransferHistory>,
  ) {}

  @Post('quote')
  async getQuote(@Body() body) {
    const exchangeRates = (await axios.get('https://crix-api-cdn.upbit.com/v1/forex/recent?codes=FRX.KRWJPY,FRX.KRWUSD')).data;
    const exchangeRate = exchangeRates.find(rate => rate.currencyCode === body.targetCurrency).basePrice;

    const fee = body.amount > 1000000 ? 3000 : 1000;
    const feeRate = body.amount > 1000000 ? 0.001 : 0.002;

    const finalFee = body.amount * feeRate + fee;
    const targetAmount = (body.amount - finalFee) / exchangeRate;

    const quote = {
      quoteId: '1', //예시 ID
      exchangeRate,
      expireTime: new Date(Date.now() + 10 * 60000).toISOString(), //10분 뒤 만료
      targetAmount: targetAmount.toFixed(2),
    };

    return {
      resultCode: 200,
      resultMsg: 'OK',
      quote,
    };
  }

  @Post('request')
  async requestTransfer(@Body() body) {
    const quote = await this.quoteRepository.findOne({ where: { id: body.quoteId } });
    if (!quote || new Date(quote.expireTime) < new Date()) {
      throw new BadRequestException('QUOTE_EXPIRED');
    }

    const user = await this.userRepository.findOne({ where: { id: quote.userId } });
    const dailyLimit = user.idType === 'REG_NO' ? 1000 : 5000;

    if (quote.targetAmount > dailyLimit) {
      throw new BadRequestException('LIMIT_EXCESS');
    }

    return {
      resultCode: 200,
      resultMsg: 'OK',
    };
  }

  @Get('list')
  async getHistory(@Req() req: Request) {
    const userId = req.user.id; //JWT에서 가져온 유저 ID

    const history = await this.transferHistoryRepository.find({ where: { userId } });

    return {
      resultCode: 200,
      resultMsg: 'OK',
      history,
    };
  }
}
