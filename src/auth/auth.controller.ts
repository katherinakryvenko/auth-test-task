import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { SimpleUserDto } from './dtos/simple-user.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { RefreshTokenRequestDto } from './dtos/refresh-token-request.dto';

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
  async signIn(@User() user: SimpleUserDto): Promise<SignInResponseDto> {
    return this.authService.signIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async signOut(@User() user: SimpleUserDto): Promise<GenericResponseDto> {
    return this.authService.signOut(user.userId);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<SignInResponseDto> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
