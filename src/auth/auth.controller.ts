import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register-auth.dto';
import { loginDto } from './dto/login-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: registerDto) {
    return await this.authService.register(dto);
  }
  @Post('login')
  async login(@Body() dto: loginDto) {
    return await this.authService.login(dto);
  }
}
