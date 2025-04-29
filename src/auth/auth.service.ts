import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,  // Access JWT service to create tokens
  ) { }

  async validateUser(email: string, phoneNumber: string, password: string): Promise<User | null> {
    const user = email ? await this.userRepository.findOne({ where: { email } }) :
      phoneNumber ? await this.userRepository.findOne({ where: { phoneNumber } }) : null;

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id }; // 'sub' is a good practice for user ID
    const access_token = this.jwtService.sign(payload);
    return {
      access_token
    };
  }
}
