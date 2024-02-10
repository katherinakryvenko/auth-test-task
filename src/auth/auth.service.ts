import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
}
