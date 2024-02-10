import { SimpleUserDto } from './simple-user.dto';

export class JwtPayloadDto extends SimpleUserDto {
  sub: number;
  iat: number;
  exp: number;
}
