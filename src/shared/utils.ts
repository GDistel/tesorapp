import { SelectQueryBuilder } from "typeorm";
import { PagedResponse } from "./interfaces";

export class Pagination {
    private maxLimit = 50;
    public skippedItems: number;
    
    constructor(public page: number, public limit: number) {
        this.page = Math.floor(page) || 1;
        this.limit = this.processLimitString(limit);
        this.skippedItems = (this.page - 1) * this.limit;
    }

    private processLimitString(limit: number): number {
        if (limit === undefined || limit === null || limit < 0) return 10;
        const validLimit = limit > this.maxLimit ? this.maxLimit : limit;
        return Math.floor(validLimit);
    }

    public paginateQuery<T>(queryBuilder: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        if (!this.skippedItems && !this.limit) {
            // Includes the case in which we want to retrieve all items (skipped items and limit are both 0)
            return queryBuilder;
        }
        return queryBuilder.offset(this.skippedItems).limit(this.limit);
    }

    public paginateItems<T>(items: T, totalCount: number): PagedResponse<T> {
        return {
            items,
            totalCount,
            page: this.page,
            limit: this.limit
        };
    }
}
