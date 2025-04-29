import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { email?: string; phoneNumber?: string; password: string }) {
    const { email, phoneNumber, password } = body;
    const user = await this.authService.validateUser(email, phoneNumber, password);

    if (!user) {
      throw new ForbiddenException('Invalid credentials');  // Throw error if user not found or password is incorrect
    }

    return this.authService.login(user);  // Return JWT token
  }
}
