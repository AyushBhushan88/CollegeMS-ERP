import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('enable-mfa')
  async enableMfa(@Body('email') email: string) {
    return this.authService.enableMfa(email);
  }

  @Post('verify-mfa')
  async verifyMfa(@Body() verifyMfaDto: VerifyMfaDto) {
    return this.authService.verifyMfa(verifyMfaDto);
  }
}
