import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SimpleUserDto } from 'src/auth/dtos/simple-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() simpleUserDto: SimpleUserDto) {
    return this.userService.getUserProfile(simpleUserDto.username);
  }
}
