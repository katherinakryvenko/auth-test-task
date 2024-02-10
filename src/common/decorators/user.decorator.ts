import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const _factory = (property: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return property ? user?.[property] : user;
};

export const User = createParamDecorator(_factory);
