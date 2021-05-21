import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Pagination } from './utils';

export const GetPagination = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req = ctx.switchToHttp().getRequest();
    const page = req.query.page;
    const limit = req.query.limit;
    if (!page || !limit) {
        throw new BadRequestException({ error: 'missing query parameters for pagination ("page" and/or "limit")' });
    }
    const pagination = new Pagination(+page, +limit);
    return pagination;
});
