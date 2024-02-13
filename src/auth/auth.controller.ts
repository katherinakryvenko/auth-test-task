import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
import { SignInDto } from './dtos/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: GenericResponseDto })
  @Post('sign-up')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<GenericResponseDto> {
    return this.authService.signUp(createUserDto);
  }

  @ApiBody({ type: SignInDto })
  @ApiResponse({ type: SignInResponseDto })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@User() user: SimpleUserDto): Promise<SignInResponseDto> {
    return this.authService.signIn(user);
  }

  @ApiBearerAuth()
  @ApiResponse({ type: GenericResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async signOut(@User() user: SimpleUserDto): Promise<GenericResponseDto> {
    return this.authService.signOut(user.userId);
  }

  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({ type: SignInResponseDto })
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<SignInResponseDto> {
    return this.authService.refreshToken(body.refreshToken);
  }
}
