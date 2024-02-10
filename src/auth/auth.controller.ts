import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from 'src/common/decorators/user.decorator';
import { SimpleUserDto } from './dtos/simple-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<GenericResponseDto> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@User() user: SimpleUserDto) {
    return this.authService.signIn(user);
  }
}
