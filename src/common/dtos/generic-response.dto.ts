import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GenericResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  @IsOptional()
  message?: string;
}
