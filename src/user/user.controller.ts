import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; //유저 엔터티

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('signup')
  async signUp(@Body() body) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const hashedIdValue = await bcrypt.hash(body.idValue, 10);

    const user = this.userRepository.create({
      userId: body.userId,
      password: hashedPassword,
      name: body.name,
      idType: body.idType,
      idValue: hashedIdValue,
    });

    await this.userRepository.save(user);

    return {
      resultCode: 200,
      resultMsg: 'OK',
    };
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.userRepository.findOne({ where: { userId: body.userId } });
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.userId });

    return {
      resultCode: 200,
      resultMsg: 'OK',
      token,
    };
  }
}
