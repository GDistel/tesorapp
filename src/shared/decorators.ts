import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Pagination } from './utils';

export const GetPagination = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req = ctx.switchToHttp().getRequest();
    const page = req.query.page;
    const limit = req.query.limit;
    if (page === undefined || page === null || page < 0 || limit === undefined || limit === null || limit < 0) {
        throw new BadRequestException({
            error: 'Missing or invalid query parameters for pagination ("page" and/or "limit"). Only positive integers allowed.'
        });
    }
    const pagination = new Pagination(+page, +limit);
    return pagination;
});
