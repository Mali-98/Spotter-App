import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: CreateAuthDto) {
    const { email, phoneNumber, password } = body;

    if (!email && !phoneNumber) {
      throw new BadRequestException(
        'Either email or phoneNumber must be provided',
      );
    }

    const user = await this.authService.validateUser(
      email,
      phoneNumber,
      password,
    );
    return this.authService.generateToken(user);
  }
}
