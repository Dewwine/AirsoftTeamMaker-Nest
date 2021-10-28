import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterProfileDto } from './dto/register-profile.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterProfileDto) {
    return this.authService.register(dto);
  }
}
