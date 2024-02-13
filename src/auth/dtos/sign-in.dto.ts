import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@example.com',
  })
  @IsString()
  @IsEmail()
  readonly username: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  @IsString()
  readonly password: string;
}
