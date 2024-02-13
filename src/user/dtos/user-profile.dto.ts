import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Username', example: 'john_doe' })
  username: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-02-13T12:34:56Z',
  })
  createdAt: Date;
}
