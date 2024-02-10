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
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
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
    const expiresIn = ''.concat(tokenTTL.toString()).concat('m');

    const payload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return {
      accessToken: accessToken,
      expirationTime: this.getExpirationTimeInMs(tokenTTL),
    };
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
}
