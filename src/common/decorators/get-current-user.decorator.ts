import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Will works when "passport" will be done
export const GetCurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
