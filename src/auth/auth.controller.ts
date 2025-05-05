import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { emailOrPhone: string; password: string }) {
    const { emailOrPhone, password } = body;

    try {
      return await this.authService.login(emailOrPhone, password);
    } catch (err) {
      throw new ForbiddenException('Invalid credentials');
    }
  }
}
