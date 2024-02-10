import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { SimpleUserDto } from './dtos/simple-user.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async signUp(user: CreateUserDto): Promise<GenericResponseDto> {
    const { email, password } = user;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      await this.userService.create(email, hashedPassword);
      return { success: true, message: 'Successfully signed up!' };
    } catch (error) {
      console.error('Error during sign-up', error);
      throw error instanceof BadRequestException
        ? error
        : new BadRequestException('Failed to sign up.');
    }
  }

  async signIn(user: SimpleUserDto): Promise<SignInResponseDto> {
    const tokenTTL = this.config.get<number>('JWT_TOKEN_TTL_MINUTES');

    const payload = {
      sub: user.userId,
      username: user.username,
    } as JwtPayloadDto;

    const refreshTokenEntity = await this.issueRefreshToken(payload);

    const accessToken = await this.issueAccessToken(payload, tokenTTL);
    return {
      accessToken: accessToken,
      expirationTime: this.getExpirationTimeInMs(tokenTTL),
      refreshToken: refreshTokenEntity.token,
    };
  }

  private async issueAccessToken(
    payload: JwtPayloadDto,
    tokenTTL: number,
  ): Promise<string> {
    const expiresIn = ''.concat(tokenTTL.toString()).concat('m');

    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  private getExpirationTimeInMs(ttlMinutes: number): number {
    const currentTime = new Date().getTime();
    const expirationDuration = ttlMinutes * 60 * 1000; // 1 minute in milliseconds
    const expirationTime = new Date(currentTime + expirationDuration).getTime();
    return expirationTime;
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<SimpleUserDto> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UserNotFoundException();

    const isPasswordCorrect = (await bcrypt.compare(
      password,
      user.password,
    )) as boolean;
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Password is incorrect');

    return { userId: user.id, username: username };
  }

  async refreshToken(refreshToken: string): Promise<SignInResponseDto> {
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!refreshTokenEntity || refreshTokenEntity.expiryDate < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = {
      sub: refreshTokenEntity.user.id,
      username: refreshTokenEntity.user.username,
    } as JwtPayloadDto;
    const tokenTTL = this.config.get<number>('JWT_TOKEN_TTL_MINUTES');
    const newAccessToken = await this.issueAccessToken(payload, tokenTTL);

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
      expirationTime: this.getExpirationTimeInMs(tokenTTL),
    };
  }

  private async issueRefreshToken(
    payload: JwtPayloadDto,
  ): Promise<RefreshTokenEntity> {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });
    refreshToken.userId = payload.sub;
    refreshToken.expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    refreshToken.issuedAt = new Date();

    return this.refreshTokenRepository.save(refreshToken);
  }
}
