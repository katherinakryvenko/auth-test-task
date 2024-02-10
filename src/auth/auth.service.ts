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
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
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
    const payload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    return {
      accessToken: accessToken,
    };
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
