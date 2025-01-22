import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route for sending OTP
  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    if (!this.authService.validatePhoneNumber(phone)) {
      throw new Error(
        'Invalid phone number format. Please use a valid Uzbek number.',
      );
    }

    await this.authService.sendOTP(phone);
    return { message: 'OTP sent successfully' };
  }

  // Route for user registration
  @Post('register')
  async register(@Body('phone') phone: string) {
    if (!this.authService.validatePhoneNumber(phone)) {
      throw new Error(
        'Invalid phone number format. Please use a valid Uzbek number.',
      );
    }

    return this.authService.registerUser(phone);
  }

  // Route for login with OTP
  @Post('login')
  async login(@Body('phone') phone: string, @Body('otp') otp: string) {
    if (!this.authService.validatePhoneNumber(phone)) {
      throw new Error(
        'Invalid phone number format. Please use a valid Uzbek number.',
      );
    }

    return this.authService.loginUser(phone, otp);
  }
}
