import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { SimpleUserDto } from 'src/auth/dtos/simple-user.dto';
import { UserProfileDto } from './dtos/user-profile.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ type: UserProfileDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() simpleUserDto: SimpleUserDto): Promise<UserProfileDto> {
    return this.userService.getUserProfile(simpleUserDto.username);
  }
}
