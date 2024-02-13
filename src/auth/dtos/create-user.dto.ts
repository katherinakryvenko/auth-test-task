import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'email@example.com' })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description:
      'User password (at least 8 characters, including at least one letter and one number)',
    example: 'passwordExample123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  readonly password: string;
}
